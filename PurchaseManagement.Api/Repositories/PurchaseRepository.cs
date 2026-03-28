using Microsoft.EntityFrameworkCore;
using PurchaseManagement.Api.Data;
using PurchaseManagement.Api.Entities;

namespace PurchaseManagement.Api.Repositories
{
    public class PurchaseRepository : IPurchaseRepository
    {
        private readonly ApplicationDbContext _context;

        public PurchaseRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PurchaseHeader?> GetByIdAsync(int id)
        {
            return await _context.PurchaseHeaders
                .Include(h => h.Items)
                .FirstOrDefaultAsync(h => h.Id == id);
        }

        public async Task<IEnumerable<PurchaseHeader>> GetAllBillsAsync()
        {
            return await _context.PurchaseHeaders.ToListAsync();
        }

        public async Task CreateAsync(PurchaseHeader purchaseHeader)
        {
            await _context.PurchaseHeaders.AddAsync(purchaseHeader);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(PurchaseHeader purchaseHeader)
        {
            // Remove old items explicitly so EF generates DELETE statements
            var oldItems = await _context.PurchaseItems
                .Where(pi => pi.PurchaseHeaderId == purchaseHeader.Id)
                .ToListAsync();
            _context.PurchaseItems.RemoveRange(oldItems);

            _context.PurchaseHeaders.Update(purchaseHeader);
            await _context.SaveChangesAsync();
        }

        public async Task AddAuditLogAsync(AuditLog log)
        {
            await _context.AuditLogs.AddAsync(log);
            await _context.SaveChangesAsync();
        }
    }
}
