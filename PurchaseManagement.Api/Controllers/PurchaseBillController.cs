using Microsoft.AspNetCore.Mvc;
using PurchaseManagement.Api.DTOs;
using PurchaseManagement.Api.Services;

namespace PurchaseManagement.Api.Controllers
{
    [ApiController]
    [Route("api/purchase-bill")]
    public class PurchaseBillController : ControllerBase
    {
        private readonly IPurchaseService _service;

        public PurchaseBillController(IPurchaseService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllBillsAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var bill = await _service.GetByIdAsync(id);
            if (bill == null) return NotFound();
            return Ok(bill);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PurchaseBillDto dto)
        {
            var id = await _service.CreateAsync(dto);
            return Ok(new { id, message = "Purchase Bill created successfully" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] PurchaseBillDto dto)
        {
            dto.Id = id;
            var success = await _service.UpdateAsync(dto);
            if (!success) return NotFound();
            return Ok(new { message = "Purchase Bill updated successfully" });
        }
    }
}
