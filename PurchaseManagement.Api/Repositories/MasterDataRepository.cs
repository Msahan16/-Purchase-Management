using Microsoft.EntityFrameworkCore;
using PurchaseManagement.Api.Data;
using PurchaseManagement.Api.Entities;

namespace PurchaseManagement.Api.Repositories
{
    public class MasterDataRepository : IMasterDataRepository
    {
        private readonly ApplicationDbContext _context;

        public MasterDataRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Item>> GetItemsAsync()
        {
            return await _context.Items.ToListAsync();
        }

        public async Task<IEnumerable<Location>> GetLocationsAsync()
        {
            return await _context.Locations.ToListAsync();
        }
    }
}
