using Microsoft.EntityFrameworkCore;
using PurchaseManagement.Api.Entities;

namespace PurchaseManagement.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Item> Items { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<PurchaseHeader> PurchaseHeaders { get; set; }
        public DbSet<PurchaseItem> PurchaseItems { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Mapping to User's MySQL Schema
            modelBuilder.Entity<Location>(entity =>
            {
                entity.ToTable("Locations");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("location_id");
                entity.Property(e => e.Name).HasColumnName("location_name");
            });

            modelBuilder.Entity<Item>(entity =>
            {
                entity.ToTable("Items");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("item_id");
                entity.Property(e => e.Name).HasColumnName("item_name");
            });

            // Standard Mappings for Purchase tables
            modelBuilder.Entity<PurchaseHeader>(entity =>
            {
                entity.ToTable("PurchaseHeaders");
            });

            modelBuilder.Entity<PurchaseItem>(entity =>
            {
                entity.ToTable("PurchaseItems");
            });

            // Audit_Logs table mapping
            modelBuilder.Entity<AuditLog>(entity =>
            {
                entity.ToTable("Audit_Logs");
                entity.HasKey(e => e.Id);
            });
        }
    }
}
