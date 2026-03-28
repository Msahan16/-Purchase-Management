using PurchaseManagement.Api.DTOs;

namespace PurchaseManagement.Api.Services
{
    public interface IMasterDataService
    {
        Task<IEnumerable<ItemDto>> GetItemsAsync();
        Task<IEnumerable<LocationDto>> GetLocationsAsync();
    }

    public interface IPurchaseService
    {
        Task<PurchaseBillDto?> GetByIdAsync(int id);
        Task<IEnumerable<PurchaseBillDto>> GetAllBillsAsync();
        Task<int> CreateAsync(PurchaseBillDto dto);
        Task<bool> UpdateAsync(PurchaseBillDto dto);
    }
}
