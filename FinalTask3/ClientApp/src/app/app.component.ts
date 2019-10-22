import { Component, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { Utility } from './shared/utility';
import { AppService } from './app.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    title = 'ClientApp';
    [x: string]: any;
    files;
    constructor(private appService: AppService) {
    }
    pdfSrc;//: any = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
    zoom = 1;
    isComponentBusy = false;
    rotation = 0;
    page = 1;
    outline = [];
    searchText = "";
    prevSearchText = "";


    public dropped(files: NgxFileDropEntry[]) {
        this.files = files;
        for (const droppedFile of files) {

            // Is it a file?
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                fileEntry.file((file: File) => {

                    // Here you can access the real file
                    console.log(droppedFile.relativePath, file);


                    this.isComponentBusy = true;
                    this.appService.uploadDoc(file).then((src) => {
                        this.pdfSrc = src;
                        this.isComponentBusy = false;
                    }, () => {
                        this.isComponentBusy = false;
                    });
                });
            } else {
                // It was a directory (empty directories are added, otherwise only files)
                const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
                console.log(droppedFile.relativePath, fileEntry);
            }
        }
    }

    incZoom() {
        this.zoom = Utility.roundAndAbs(this.zoom + 0.1);
    }

    decZoom() {
        this.zoom = Utility.roundAndAbs(this.zoom - 0.1);
    }

    rotateLeft() {
        this.rotation = (this.rotation - 90) % 360;
    }

    rotateRight() {
        this.rotation = (this.rotation + 90) % 360;
    }

    incPage() {
        this.page++;
    }

    decPage() {
        this.page--;
    }

    @ViewChild(PdfViewerComponent, { static: false }) private pdfComponent: PdfViewerComponent;

    search() {
        if (this.prevSearchText !== this.searchText) {
            this.prevSearchText = this.searchText;
            this.pdfComponent.pdfFindController.executeCommand('find', {
                caseSensitive: false, findPrevious: undefined, highlightAll: true, phraseSearch: true, query: this.searchText
            });
        }
        else {
            this.pdfComponent.pdfFindController.executeCommand('findagain', {
                caseSensitive: false, findPrevious: undefined, highlightAll: true, phraseSearch: true, query: this.searchText
            });

        }
    }

    close() {
        this.pdfSrc = undefined;
    }
}
