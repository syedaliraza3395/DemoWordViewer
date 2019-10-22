using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Aspose.Words;
using Aspose.Words.Saving;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FinalTask3.Controllers
{
    [Route("api/[controller]")]
    public class ConversionController : Controller
    {
        private readonly IHostingEnvironment _env;

        public ConversionController(IHostingEnvironment env)
        {
            _env = env;
        }

        /// <summary>
        /// This action can be used to convert a word document to pdf document
        /// </summary>
        /// <param name="file">word file</param>
        /// <returns>pdf Base64</returns>
        [HttpPost("[action]")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return Content("file not selected");

            var docPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot","temp_conversion.docx");
            var pdfPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot","temp_conversion.pdf");
            Document doc;
            PdfSaveOptions imageOptions = new PdfSaveOptions();
            imageOptions.JpegQuality = 100;

            //saving received file to 'docPath' directory and reading it in stream
            using (var stream = new FileStream(docPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);

                //passing the document in stream to Aspose.Words.Document constructor to parse and create a pdf file
                doc = new Document(stream);
                doc.Save(pdfPath, imageOptions);
            }

            //reading saved pdf document and delivering its byte[] as response
            var memory = new MemoryStream();
            using (var stream = new FileStream(pdfPath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory.ToArray(), "application/pdf", Path.GetFileName(pdfPath));
        }
    }
}
