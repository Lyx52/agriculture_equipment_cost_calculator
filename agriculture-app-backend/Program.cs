using System.Text.Json;
using agriculture_app_backend.Infrastructure.Data;
using agriculture_app_backend.Infrastructure.Models;
using agriculture_app_backend.Infrastructure.Settings;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.Configure<ApplicationSettings>(builder.Configuration.GetSection(nameof(ApplicationSettings)));
var settings = builder.Configuration.GetSection(nameof(ApplicationSettings)).Get<ApplicationSettings>();
if (settings is null)
    throw new ApplicationException("Cannot get ApplicationSettings section from appsettings!");
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddDbContext<PersistentDbContext>(optionsBuilder =>
{
    optionsBuilder.UseNpgsql($"Host={settings.DbHostname};Username={settings.DbUsername};Password={settings.DbPassword};Database={settings.DbName}",
        opt => opt.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery));
}, ServiceLifetime.Transient);

builder.Services.AddCors(options =>
{
    options.AddPolicy("DefaultCorsPolicy",
        policyBuilder =>
        {
            policyBuilder.WithOrigins("http://localhost:9696");
        }
    );
});

var app = builder.Build();

// Startup tasks
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<PersistentDbContext>();
    context.Database.EnsureCreatedAsync().GetAwaiter().GetResult();
    context.Set<Codifier>().ExecuteDelete();
    context.Set<Equipment>().ExecuteDelete();
    context.SaveChanges();
    
    // Import codifiers
    foreach (var file in Directory.GetFiles("seed/codifiers", "*.json"))
    {
        using var fs = File.OpenRead(file);
        var codifiers = JsonSerializer.Deserialize<List<Codifier>>(fs);
        context.AddRange(codifiers!);
    }
    
    // Import catalog data
    using var fsCatalog = File.OpenRead("seed/catalog_data.json");
    var equipment = JsonSerializer.Deserialize<List<Equipment>>(fsCatalog);
    context.AddRange(equipment!);
    context.SaveChanges();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("DefaultCorsPolicy");
app.MapControllers()
    .WithOpenApi();
app.UseHttpsRedirection();
app.Run();