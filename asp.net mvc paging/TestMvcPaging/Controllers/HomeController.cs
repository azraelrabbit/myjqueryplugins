using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;

namespace TestMvcPaging.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult GetPagedList(string content, int pageIndex, int pageSize)
        {
            Thread.Sleep(1000);
            var skip = (pageIndex > 0 ? pageIndex - 1 : 0)*pageSize;
            var itemlist=G.DataCache.Skip(skip).Take(pageSize).ToList();

            ViewData["TotalRow"] = G.DataCache.Count;
            ViewData["content"] = content;
          ViewData["PageIndex"]=pageIndex;
            ViewData["PageSize"]=pageSize;
            return View(model: itemlist);
        }
    }
}