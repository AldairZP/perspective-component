package org.fakester.gateway;

import java.util.Optional;

import org.fakester.common.RadComponents;
import org.fakester.common.component.display.ToastSileo;

import com.inductiveautomation.ignition.common.licensing.LicenseState;
import com.inductiveautomation.ignition.common.util.LoggerEx;
import com.inductiveautomation.ignition.gateway.model.AbstractGatewayModuleHook;
import com.inductiveautomation.ignition.gateway.model.GatewayContext;
import com.inductiveautomation.perspective.common.api.ComponentRegistry;
import com.inductiveautomation.perspective.gateway.api.PerspectiveContext;
import com.inductiveautomation.ignition.common.gson.JsonObject;
import com.inductiveautomation.ignition.gateway.dataroutes.RouteGroup;

public class RadGatewayHook extends AbstractGatewayModuleHook {

    private static final LoggerEx log = LoggerEx.newBuilder().build("rad.gateway.RadGatewayHook");

    private GatewayContext gatewayContext;
    private PerspectiveContext perspectiveContext;
    private ComponentRegistry componentRegistry;

    @Override
    public void setup(GatewayContext context) {
        this.gatewayContext = context;
        log.info("Setting up RadComponents module.");
    }

    @Override
    public void startup(LicenseState activationState) {
        log.info("Starting up RadGatewayHook!");

        this.perspectiveContext = PerspectiveContext.get(this.gatewayContext);
        this.componentRegistry = this.perspectiveContext.getComponentRegistry();
        if (this.componentRegistry != null) {
            log.info("Registering Rad components.");
            this.componentRegistry.registerComponent(ToastSileo.DESCRIPTOR);
        } else {
            log.error("Reference to component registry not found, Rad Components will fail to function!");
        }

    }

    @Override
    public void shutdown() {
        log.info("Shutting down RadComponent module and removing registered components.");
        if (this.componentRegistry != null) {
            this.componentRegistry.removeComponent(ToastSileo.COMPONENT_ID);
        } else {
            log.warn("Component registry was null, could not unregister Rad Components.");
        }

    }

    @Override
    public Optional<String> getMountedResourceFolder() {
        return Optional.of("mounted");
    }

    // Lets us use the route http://<gateway>/res/radcomponents/*
    @Override
    public Optional<String> getMountPathAlias() {
        return Optional.of(RadComponents.URL_ALIAS);
    }

   public boolean isMakerEditionCompatible() {
      return true;
   }

    @Override
    public boolean isFreeModule() {
        return true;
    }

    public static JsonObject fetchLicenseState() {
        boolean isActivated = true;
        boolean isTrialExpired = false;
        JsonObject json = new JsonObject();
        json.addProperty("isActivated", isActivated);
        json.addProperty("isTrialExpired", isTrialExpired);
        return json;
    }

    public void mountRouteHandlers(RouteGroup routes) {
        RadEndpoints.mountRoutes(routes);
    }

}
