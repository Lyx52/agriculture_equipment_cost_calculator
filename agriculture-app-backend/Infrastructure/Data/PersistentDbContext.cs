using AgricultureAppBackend.Infrastructure.Converters;
using AgricultureAppBackend.Infrastructure.Data.Model;
using AgricultureAppBackend.Infrastructure.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AgricultureAppBackend.Infrastructure.Data;

public class PersistentDbContext(
    DbContextOptions<PersistentDbContext> options, 
    ILogger<PersistentDbContext> logger
) : IdentityDbContext<User>(options)
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
        
        modelBuilder.Entity<User>()
            .HasMany(e => e.Equipment)
            .WithMany(e => e.Users);

        base.OnModelCreating(modelBuilder);
    }
}