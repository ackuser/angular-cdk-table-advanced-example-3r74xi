import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FetchPages } from "./fetch.pages.pipe";
import { PaginatorComponent } from "./paginator.component";

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [PaginatorComponent, FetchPages],
  exports: [PaginatorComponent]
})
export class PaginatorModule {}
