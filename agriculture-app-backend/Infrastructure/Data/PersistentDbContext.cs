using agriculture_app_backend.Infrastructure.Converters;
using agriculture_app_backend.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace agriculture_app_backend.Infrastructure.Data;

public class PersistentDbContext(
    DbContextOptions<PersistentDbContext> options, 
    ILogger<PersistentDbContext> logger
) : DbContext(options)
{
    public DbSet<Codifier> Codifiers { get; set; }
    public DbSet<Equipment> Equipment { get; set; }
    private readonly ILogger<PersistentDbContext> _logger = logger;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Codifier>()
            .HasOne(c => c.Parent)
            .WithMany(p => p.Children)
            .HasForeignKey(c => c.ParentCode)
            .OnDelete(DeleteBehavior.Restrict); 
        
        modelBuilder.Entity<Equipment>()
            .Property(e => e.Specifications)
            .HasConversion(new JsonValueConverter<EquipmentSpecification>())
            .HasColumnType("jsonb");
        
        base.OnModelCreating(modelBuilder);
    }
}