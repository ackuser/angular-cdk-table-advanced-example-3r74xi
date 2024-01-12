import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { isNumeric } from "rxjs/internal-compatibility";

@Pipe({
  name: "fetchPages"
})
export class FetchPages implements PipeTransform {
  transform(pages: any[]): any {
    if (pages) {
      return pages.reduce((acc, page) => {
        if (isNumeric(page)) {
          acc.push({
            page: true,
            value: page
          });
        } else {
          acc.push({
            page: false,
            value: page
          });
        }
        return acc;
      }, []);
    }
  }
}
