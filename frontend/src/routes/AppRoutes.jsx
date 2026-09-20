import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import DashboardPage from "../pages/DashboardPage";
import ForbiddenPage from "../pages/ForbiddenPage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";

import AppLayout from "../layouts/AppLayout";
import AdminPage from "../pages/AdminPage";
import RequireRole from "./RequireRole";

import UsersPage from "../pages/UsersPage";
import RequirePermission from "./RequirePermission";

import CreateUserPage from "../pages/CreateUserPage";
import EditUserPage from "../pages/EditUserPage";

import PermissionsPage from "../pages/PermissionsPage";
import RolesPage from "../pages/RolesPage";

import CreateRolePage from "../pages/CreateRolePage";
import EditRolePage from "../pages/EditRolePage";

import RolePermissionsPage from "../pages/RolePermissionsPage";
import UserRolesPage from "../pages/UserRolesPage";

import CreatePermissionPage from "../pages/CreatePermissionPage";
import EditPermissionPage from "../pages/EditPermissionPage";

function AppRoutes() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

               <Route element={<ProtectedRoute />}>

    <Route element={<AppLayout />}>

        <Route
            path="/"
            element={<DashboardPage />}
        />
        <Route
    element={
        <RequirePermission permission="USER_CREATE" />
    }
>
    <Route
        path="/users/new"
        element={<CreateUserPage />}
    />
</Route>

<Route
    element={
        <RequirePermission permission="USER_UPDATE" />
    }
>
    <Route
        path="/users/:id/edit"
        element={<EditUserPage />}
    />
</Route>

        <Route
            element={
                <RequirePermission
                    permission="USER_READ"
                />
            }
        >
            <Route
                path="/users"
                element={<UsersPage />}
            />
        </Route>

        <Route
            element={
                <RequireRole role="ROLE_ADMIN" />
            }
        >
            <Route
                path="/admin"
                element={<AdminPage />}
            />
            <Route element={<RequireRole role="ROLE_ADMIN" />}>
    <Route
        path="/admin"
        element={<AdminPage />}
    />

    <Route
        path="/roles"
        element={<RolesPage />}
    />

    <Route
        path="/permissions"
        element={<PermissionsPage />}
    />
    <Route
    path="/permissions/new"
    element={<CreatePermissionPage />}
/>

<Route
    path="/permissions/:id/edit"
    element={<EditPermissionPage />}
/>
    <Route
    path="/roles/new"
    element={<CreateRolePage />}
/>
<Route
    path="/users/:id/roles"
    element={<UserRolesPage />}
/>
<Route
    path="/roles/:id/permissions"
    element={<RolePermissionsPage />}
/>
<Route
    path="/roles/:id/edit"
    element={<EditRolePage />}
/>
</Route>
        </Route>

    </Route>

</Route>



                <Route
                    path="/forbidden"
                    element={<ForbiddenPage />}
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;