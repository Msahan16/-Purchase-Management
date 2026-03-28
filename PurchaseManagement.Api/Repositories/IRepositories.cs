using PurchaseManagement.Api.Entities;

namespace PurchaseManagement.Api.Repositories
{
    public interface IMasterDataRepository
    {
        Task<IEnumerable<Item>> GetItemsAsync();
        Task<IEnumerable<Location>> GetLocationsAsync();
    }

    public interface IPurchaseRepository
    {
        Task<PurchaseHeader?> GetByIdAsync(int id);
        Task<IEnumerable<PurchaseHeader>> GetAllBillsAsync();
        Task CreateAsync(PurchaseHeader purchaseHeader);
        Task UpdateAsync(PurchaseHeader purchaseHeader);
        Task AddAuditLogAsync(AuditLog log);
    }
}
