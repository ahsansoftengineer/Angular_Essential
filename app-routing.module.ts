import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FullComponent } from "./layouts/full/full.component";

const routes: Routes = [
  {
    path: "",
    component: FullComponent,
    children: [
      // {
      //   path: "",
      //   redirectTo: "/dashboard",
      //   pathMatch: 'full'
      // },
      {
        path: "admin",
        loadChildren: () =>
          import("./admin/admin.module").then(
            (m) => m.AdminModule
          ),
      },
      {
        path: "dashboard",
        loadChildren: () =>
          import("./dashboards/dashboard.module").then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: "",
        loadChildren: () =>
          import("./feature/feature.module").then(
            (m) => m.FeatureModule
          ),
      }
      // {
      //   path: "",
      //   redirectTo: "/dashboard",
      //   pathMatch: 'full'
      // }
    ],
  },
  // {
  //   path: "",
  //   component: BlankComponent,
  //   children: [
  //     {
  //       path: "authentication",
  //       loadChildren: () =>
  //         import("./authentication/authentication.module").then(
  //           (m) => m.AuthenticationModule
  //         ),
  //     },
  //   ],
  // },
  {
    path: "**",
    redirectTo: "/authentication/404",
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
