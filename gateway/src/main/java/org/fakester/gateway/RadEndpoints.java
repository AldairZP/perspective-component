package org.fakester.gateway;

import com.inductiveautomation.ignition.common.gson.JsonObject;
import com.inductiveautomation.ignition.gateway.dataroutes.RequestContext;
import com.inductiveautomation.ignition.gateway.dataroutes.RouteGroup;
import javax.servlet.http.HttpServletResponse;

public final class RadEndpoints {
    private RadEndpoints() {
    }

    public static void mountRoutes(RouteGroup routes) {
        routes.newRoute("/module/licenseState").type("application/json").handler(RadEndpoints::fetchLicenseState)
                .mount();
    }

    private static JsonObject fetchLicenseState(RequestContext req, HttpServletResponse res) {

        JsonObject json = new JsonObject();
        json.addProperty("isActivated", (Boolean) true);
        json.addProperty("isTrialExpired", (Boolean) false);
        return json;
    }
}