import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injector } from '@angular/core';
import { DynamicDatabase } from '../class/DynamicDataBase';
import { DynamicDataSource } from '../class/DynamicDataSource';
import { AnalysisFlat } from '../class/DynamicFlatNode';
import { BaseFormDropDown } from './base.form.drop-down';
import { Custom } from './custom';

@Component({
  selector: 'di-tree-view',
  template: '',
  styles: [''],
  providers: [DynamicDatabase],
})
export class TreeView<T> extends BaseFormDropDown<T> {
  constructor(public injector: Injector) {
    super(injector);
    this.database = injector.get(DynamicDatabase);
    this.treeControl = new FlatTreeControl<AnalysisFlat>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new DynamicDataSource(this.treeControl, this.database);

    // No Need to Load Data First Time
    // this.database.getAnalysis().subscribe((res) => {
    //   this.dataSource.data = res.data.records;
    // });
  }
  ngOnInit() {
    this._form.valueChanges.subscribe((selectedValue) => {
      this.dataSource.data = [];
    });
    this.database.dbForm = this._form;
  }

  database: DynamicDatabase;
  treeControl: FlatTreeControl<AnalysisFlat>;
  dataSource: DynamicDataSource;
  _process(param: string = '') {
    this.dataSource._activeNode = '';
    let data = { ...this._form.value };
    data.level = '1';
    data = Custom.objToURLQuery(data);
    this.database.getAnalysis(data).subscribe((res) => {
      this.dataSource.data = res.data.records;
    });
  }
  saveNodeTree(node: AnalysisFlat) {
    let data = { ...this._form.value };
    data.id = node.id;
    data.level = node.level;
    data.checked = node.checked;
    this.database.saveAnalysis(data).subscribe();
  }
  _disabledNode(node: AnalysisFlat) {
    return (
      node.id !== this.dataSource?._activeNode &&
      this.dataSource?._activeNode != '' &&
      node.level === 1
    );
  }
  getLevel = (node: AnalysisFlat) => {
    return node.level;
  };
  isExpandable = (node: AnalysisFlat) => {
    return node.expandable;
  };

  hasChild = (_: number, _nodeData: AnalysisFlat) => {
    return _nodeData.expandable;
  };
  /* Allowed multiple Selection */
  checklistSelection = new SelectionModel<AnalysisFlat>(true);
  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: AnalysisFlat): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => {
        if (child.isExpanded) {
          return this.checklistSelection.isSelected(child);
        } else {
          return child.checked;
        }
      });
    return descAllSelected;
  }
  descendantsAllSelected_Freez(node: AnalysisFlat) {
    if (node.allowed >= node.total && node.total != 0) {
      return true;
    } else return false;

    // return this.descendantsAllSelected(node);
  }
  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: AnalysisFlat): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    if (result && !this.descendantsAllSelected(node)) {
      node.checked = 2;
    } else if (this.descendantsAllSelected(node)) {
      node.checked = 1;
    }
    // return node.status;
    return result && !this.descendantsAllSelected(node);
  }
  descendantsPartiallySelected_Freez(node) {
    if (
      node.allowed != 0 &&
      node.allowed != node.total &&
      node.allowed < node.total
    ) {
      return true;
    } else {
      return false;
      //this.descendantsPartiallySelected(node);
    }
  }
  checklistSelection_Freez(node: AnalysisFlat) {
    if (node.checked === 1) {
      return true;
    } else false;
    // return this.checklistSelection.isSelected(node);
  }
  // Only For Parent Toggle Selection
  todoItemSelectionToggle(node: AnalysisFlat): void {
    if (node.checked == 1) {
      node.checked = 0;
      node.allowed = 0
    } else {
      node.checked = 1;
      node.allowed = node.total
    }
    if (this.treeControl.isExpanded(node)) {
      const descendants = this.treeControl.getDescendants(node);
      descendants.forEach((child) => {
        if (node.checked == 1) {
          child.allowed = child.total;
          child.checked = 1;
        } else {
          child.allowed = 0;
          child.checked = 0;
        }
      });
    }
    this.checkAllParentsSelection(node);
    this.saveNodeTree(node);
  }
  // For Child Toggle Selection
  todoLeafItemSelectionToggle(node: AnalysisFlat): void {
    if (node.checked == 1) {
      console.log('in');
      node.checked = 0;
      node.allowed = 0
    } else {
      node.checked = 1;
      node.allowed = node.total
    }
    // this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    // node.checked = +this.checklistSelection.isSelected(node);
    this.saveNodeTree(node);
  }
  checkAllParentsSelection(node: AnalysisFlat): void {
    let parent: AnalysisFlat | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      if (node.checked == 1) {
        parent.allowed += node.total
      }
      else {
        parent.allowed -= node.total
      };
      parent = this.getParentNode(parent);
    }
  }
  checkRootNodeSelection(node: AnalysisFlat): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }
  getParentNode(node: AnalysisFlat): AnalysisFlat | null {
    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
}
