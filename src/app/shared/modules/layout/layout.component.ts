import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { INITIAL_LAYOUT_MODEL } from "./model/layout-model";
import { DragulaService } from "ng2-dragula";
import { Subscription } from "rxjs";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.css"],
})
export class LayoutComponent implements OnInit {
  @Input() layoutModel = INITIAL_LAYOUT_MODEL;
  @Input() visualizationType: string;
  @Output() onLayoutUpdate = new EventEmitter();
  @Output() onLayoutClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  filters: any;
  columns: any;
  rows: any;
  icons: any;
  dimensions: any;
  columnName: string;
  rowName: string;
  msg = "";
  subs = new Subscription();

  constructor(private dragula: DragulaService) {
    this.icons = {
      dx: "assets/icons/data.png",
      ou: "assets/icons/tree.png",
      pe: "assets/icons/period.png",
    };
    this.dimensions = {
      filterDimension: [],
      columnDimension: [],
      rowDimension: [],
    };
    this.columnName = "Column dimensions";
    this.rowName = "Row dimensions";
    // dragula.createGroup('bag-one', {
    //   removeOnSpill: true
    // });
    // this.subs.add(this.dragula.drop('bag-one')
    //   .subscribe((response: any) => {
    //     console.log(response);
    //   })
    // );
  }

  ngOnInit() {
    this.updateLayoutDimensions();
    if (this.visualizationType === "CHART") {
      this.rowName = "Categories dimensions";
      this.columnName = "Series dimensions";
    }

    this.dragula.dropModel().subscribe((response: any) => {
      // now filter the sourceModel and targetModel from response
      console.log(response);
      console.log(response.sourceModel, response.targetModel);
      console.log(JSON.stringify(this.layoutModel));

      // setTimeout(() => {
      //   if (this.columns.length < 1) {
      //     this.rows = [...this.layoutModel.columns];
      //     this.columns = [...this.layoutModel.rows];
      //   } else if (this.rows.length < 1) {
      //     this.columns = [...this.layoutModel.columns];
      //     this.rows = [...this.layoutModel.rows];
      //   }
      // }, 1000);
    });
    // .subscribe(value => {
    //   setTimeout(() => {
    //     if (this.columns.length < 1) {
    //       this.rows = [...this.layoutModel.columns];
    //       this.columns = [...this.layoutModel.rows];
    //     } else if (this.rows.length < 1) {
    //       this.columns = [...this.layoutModel.columns];
    //       this.rows = [...this.layoutModel.rows];
    //     }
    //   }, 1000);
    // });
  }

  updateLayoutDimensions() {
    this.filters = [...this.layoutModel.filters];
    this.columns = [...this.layoutModel.columns];
    this.rows = [...this.layoutModel.rows];
  }

  updateLayout() {
    this.onLayoutUpdate.emit({
      filters: this.filters,
      columns: this.columns,
      rows: this.rows,
    });
    // console.log(JSON.stringify({
    //   filters: this.filters,
    //   columns: this.columns,
    //   rows: this.rows
    // }))
  }

  close() {
    this.onLayoutClose.emit(true);
  }
}
