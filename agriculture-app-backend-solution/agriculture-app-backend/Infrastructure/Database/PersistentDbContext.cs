using AgricultureAppBackend.Infrastructure.Converters;
using AgricultureAppBackend.Infrastructure.Database.Model;
using AgricultureAppBackend.Infrastructure.Models.Json;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AgricultureAppBackend.Infrastructure.Database;

public class PersistentDbContext(
    DbContextOptions<PersistentDbContext> options, 
    ILogger<PersistentDbContext> logger
) : IdentityDbContext<User>(options)
{
    public DbSet<Codifier> Codifiers { get; set; }
    public DbSet<Equipment> Equipment { get; set; }
    public DbSet<UserEquipment> UserEquipment { get; set; }
    public DbSet<UserFarmland> UserFarmlands { get; set; }
    public DbSet<UserCropType> UserCropTypes { get; set; }
    public DbSet<FarmlandOperation> FarmlandOperations { get; set; }
    public DbSet<UserAdjustment> UserAdjustments { get; set; }
    private readonly ILogger<PersistentDbContext> _logger = logger;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Codifier>()
            .HasOne(c => c.Parent)
            .WithMany(p => p.Children)
            .HasForeignKey(c => c.ParentCode)
            .OnDelete(DeleteBehavior.NoAction); 
        
        modelBuilder.Entity<Codifier>()
            .HasMany<FarmlandOperation>(e => e.Operations)
            .WithOne(c => c.Operation)
            .HasForeignKey(e => e.OperationCode)
            .OnDelete(DeleteBehavior.NoAction);
        
        modelBuilder.Entity<Codifier>()
            .HasMany<UserAdjustment>(e => e.Adjustments)
            .WithOne(c => c.AdjustmentType)
            .HasForeignKey(e => e.AdjustmentTypeCode)
            .OnDelete(DeleteBehavior.NoAction);
        
        modelBuilder.Entity<UserCropType>()
            .HasMany<UserFarmland>(e => e.UserFarmlands)
            .WithOne(c => c.ProductCropType)
            .HasForeignKey(e => e.ProductCropTypeId)
            .OnDelete(DeleteBehavior.SetNull);
        
        modelBuilder.Entity<Equipment>()
            .Property(e => e.Specifications)
            .HasConversion(new JsonValueConverter<EquipmentSpecification>())
            .HasColumnType("jsonb");
        
        modelBuilder.Entity<UserEquipment>()
            .Property(e => e.Specifications)
            .HasConversion(new JsonValueConverter<EquipmentSpecification>())
            .HasColumnType("jsonb");
        
        modelBuilder.Entity<UserEquipment>()
            .Property(e => e.Usage)
            .HasConversion(new JsonValueConverter<EquipmentUsage>())
            .HasColumnType("jsonb");
        
        modelBuilder.Entity<User>()
            .HasMany(e => e.Equipment)
            .WithOne(e => e.User)
            .HasForeignKey(e => e.UserId);
        
        modelBuilder.Entity<User>()
            .HasMany(e => e.Farmlands)
            .WithOne(e => e.User)
            .HasForeignKey(e => e.UserId);

        modelBuilder.Entity<User>()
            .HasMany(e => e.CropTypes)
            .WithOne(e => e.User)
            .HasForeignKey(e => e.UserId);
        
        modelBuilder.Entity<User>()
            .HasMany(e => e.Adjustments)
            .WithOne(e => e.User)
            .HasForeignKey(e => e.UserId);
        
        modelBuilder.Entity<UserFarmland>()
            .HasMany(e => e.Operations)
            .WithOne(e => e.UserFarmland)
            .HasForeignKey(e => e.UserFarmlandId)
            .OnDelete(DeleteBehavior.Cascade);
        
        base.OnModelCreating(modelBuilder);
    }
}