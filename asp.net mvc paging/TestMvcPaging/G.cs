
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TestMvcPaging
{
    public static class G
    {

        public static List<MyData> DataCache;

        static  G()
        {
            DataCache=new List<MyData>();

            for (var i = 0; i < 150; i++)
            {
                var d=new MyData()
                {
                    Name = "I "+(i+1).ToString(),
                    Address = "ADD "+i.ToString(),
                    Mail = "m_"+i.ToString()+"@m.com",
                    Title = "t_"+i.ToString()
                };
                DataCache.Add(d);
            }
        }


    }
}