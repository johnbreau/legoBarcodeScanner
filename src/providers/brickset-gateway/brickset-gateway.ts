import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class BricksetGateway {
  private apiKey: string;
  private userHash: string;
  private setID: string;

  constructor(public http: HttpClient) {
    console.log('Hello BricksetGateway Provider');
  }

  bricketGetSet() {
    this.apiKey = 'PEVh-NM7r-No3K';
    this.userHash = 'johnbreau';
    this.setID = '6391'
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://brickset.com/api/v2.asmx?WSDL', true);

    let sr =
        `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
            <getSet xmlns="https://brickset.com/api/">
              <apiKey>` + this.apiKey + `</apiKey>
              <userHash>` + this.userHash + `</userHash>
              <SetID>` + this.setID + `</SetID>
            </getSet>
          </soap:Body>
        </soap:Envelope>`;

    xmlhttp.onreadystatechange =  () => {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                // let xml = xmlhttp.responseXML;
                // let response_number = parseInt(xml.getElementsByTagName("li")[0].childNodes[0].nodeValue); //Here I'm getting the value contained by the <return> node
                // console.log(response_number); //I'm printing my result square number
                console.log(xmlhttp.response);
                console.log(xmlhttp.responseXML);
            }
        }
    }
    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.responseType = "document";
    xmlhttp.send(sr);
  }

}
