import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CdkTableModule } from "@angular/cdk/table";
import { MatSortModule } from "@angular/material/sort";

import { AppComponent } from "./app.component";
import { HighlightSearch } from "./highlight.pipe";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PaginatorModule } from "../paginator/paginator.module";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CdkTableModule,
    MatSortModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    PaginatorModule
  ],
  declarations: [AppComponent, HighlightSearch],
  bootstrap: [AppComponent]
})
export class AppModule {}
