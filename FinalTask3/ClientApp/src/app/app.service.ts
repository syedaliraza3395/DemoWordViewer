import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class AppService {
    baseUrl;
    constructor(private http: HttpClient) {
        this.baseUrl = document.getElementsByTagName('base')[0].href;
    }

    uploadDoc(file) {

        // You could upload it like this:
        const formData = new FormData()
        formData.append('file', file)

        // Headers
        const headers = new HttpHeaders({
            'security-token': 'mytoken'
        })
        return new Promise((success, failure) => {
            this.http.post(this.baseUrl + 'api/Conversion/UploadFile', formData, { headers: headers, responseType: 'blob' })
                .subscribe(result => {
                    var reader = new FileReader();
                    reader.readAsDataURL(result);
                    reader.onloadend = () => {
                        success(reader.result);
                    }
                }, () => {
                    failure();
                })
        })
    }

}