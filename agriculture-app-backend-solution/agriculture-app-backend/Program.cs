using System.Text;
using System.Text.Json;
using AgricultureAppBackend.Infrastructure.Constants;
using AgricultureAppBackend.Infrastructure.Database;
using AgricultureAppBackend.Infrastructure.Database.Model;
using AgricultureAppBackend.Infrastructure.Services;
using AgricultureAppBackend.Infrastructure.Services.Interfaces;
using AgricultureAppBackend.Infrastructure.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace AgricultureAppBackend;

public class Program {
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.Configure<ApplicationSettings>(builder.Configuration.GetSection(nameof(ApplicationSettings)));
        var settings = builder.Configuration.GetSection(nameof(ApplicationSettings)).Get<ApplicationSettings>();
        if (settings is null)
            throw new ApplicationException("Cannot get ApplicationSettings section from appsettings!");
        builder.Services.AddSingleton<ApplicationSettings>(provider =>
        {
            var configuration = provider.GetRequiredService<IConfiguration>();
            return configuration.GetSection(nameof(ApplicationSettings)).Get<ApplicationSettings>()!;
        });

        builder.Services.AddSingleton<IJwtTokenProvider, JwtTokenProvider>();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(options =>
        {
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "JWT Authentication token",
                Name = "Authorization",
                Type = SecuritySchemeType.ApiKey
            });
            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new string[] { }
                }
            });
        });
        builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.WriteIndented = true;
                options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower;
                options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.SnakeCaseUpper;
            });

        builder.Services.AddMemoryCache();
        builder.Services.AddHttpClient();
        var env = builder.Environment;
        if (env.IsEnvironment("Test"))
        {
            var sqliteConnection = new SqliteConnection("Data Source=:memory:");
            sqliteConnection.Open();

            builder.Services.AddDbContext<PersistentDbContext>(optionsBuilder =>
            {
                optionsBuilder.UseSqlite(sqliteConnection,
                    sqliteOptions =>
                    {
                        sqliteOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                    });
            });
        }
        else
        {
            builder.Services.AddDbContext<PersistentDbContext>(optionsBuilder =>
            {
                optionsBuilder.UseNpgsql(
                    $"Host={settings.DbHostname};Username={settings.DbUsername};Password={settings.DbPassword};Database={settings.DbName}",
                    opt => opt.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery));
            }, ServiceLifetime.Transient);
        }

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("DefaultCorsPolicy",
                policyBuilder =>
                {
                    policyBuilder.WithOrigins(settings.CorsSettings);
                    policyBuilder.AllowCredentials();
                    policyBuilder.WithMethods("POST", "GET", "PUT", "DELETE", "OPTIONS");
                    policyBuilder.WithHeaders("authorization", "content-type");
                }
            );
        });

        builder.Services.AddIdentity<User, IdentityRole>(options =>
            {
                options.Password = PasswordRequirementsConfiguration.Default;
            })
            .AddEntityFrameworkStores<PersistentDbContext>()
            .AddDefaultTokenProviders();

        builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                var key = Encoding.ASCII.GetBytes(settings.JwtKey);
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = settings.JwtIssuer,
                    ValidAudience = settings.JwtAudience,
                    ValidateIssuerSigningKey = true,
                    RequireExpirationTime = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

        builder.Services.AddAuthorization();
        var app = builder.Build();
        app.UseCors("DefaultCorsPolicy");
        
        app.UseAuthentication();
        app.UseAuthorization();

        // Startup tasks
        using (var scope = app.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<PersistentDbContext>();
            context.Database.MigrateAsync().GetAwaiter().GetResult();
            context.SaveChangesAsync().GetAwaiter().GetResult();

            var codifierSet = context.Set<Codifier>();
            var existing = codifierSet.ToListAsync().GetAwaiter().GetResult().ToDictionary(c => c.Code);
            // Import codifiers
            foreach (var file in Directory.GetFiles("seed/codifiers", "*.json"))
            {
                using var fs = File.OpenRead(file);
                var codifiers = JsonSerializer.Deserialize<List<Codifier>>(fs);
                foreach (var codifier in codifiers!)
                {
                    if (existing.TryGetValue(codifier.Code, out var existingCodifier))
                    {
                        existingCodifier.Name = codifier.Name;
                        existingCodifier.Value = codifier.Value;
                        existingCodifier.ParentCode = codifier.ParentCode;
                        context.Update(existingCodifier);
                    }
                    else
                    {
                        context.Add(codifier);
                    }
                }
            }
            
            context.Set<Equipment>().ExecuteDeleteAsync().GetAwaiter().GetResult();
            context.SaveChangesAsync().GetAwaiter().GetResult();
            
            // Import catalog data
            using var fsCatalog = File.OpenRead("seed/catalog_data.json");
            var equipment = JsonSerializer.Deserialize<List<Equipment>>(fsCatalog);
            context.AddRange(equipment!);
            context.SaveChangesAsync().GetAwaiter().GetResult();
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
    }
}