using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using System.Net.Sockets;
using System.IO;

namespace nodejsdatalistener
{
class Program
{

    public static string nameOfTheFile;
    static void Main(string[] args)
    {
            Socket soc = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            IPAddress ipReceive = IPAddress.Any;
            var listener = new TcpListener(ipReceive, 11000);
            data2:
            try
        {
           


            Console.WriteLine("listening: " + ipReceive);
              
             while(true)
            {
                listener.Start();
                using (var client = listener.AcceptTcpClient())
                using (var stream = client.GetStream())
                {
                
                     
                            while (true)
                            {
                                
                                Byte[] data = new Byte[256];

                                // String to store the response ASCII representation.
                                String responseData = String.Empty;
                                NetworkStream networkStream = client.GetStream();
                                // Read the first batch of the TcpServer response bytes.
                                int bytes = stream.Read(data, 0, data.Length);
                                responseData = System.Text.Encoding.ASCII.GetString(data, 0, bytes);
                                nameOfTheFile = responseData;
                                Console.WriteLine(nameOfTheFile);
                                string serverResponse = "I hear you";
                                Byte[] sendBytes = Encoding.ASCII.GetBytes(serverResponse);
                                networkStream.Write(sendBytes, 0, sendBytes.Length);
                                //networkStream.Flush();
                                //break;
                            }
                        }

                }


            

        }
        catch (Exception e)
        {
            Console.WriteLine("kek " + e.Message);
               goto data2;
        }
    }


}
}
