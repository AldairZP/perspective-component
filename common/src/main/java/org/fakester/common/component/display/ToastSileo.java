package org.fakester.common.component.display;

import org.fakester.common.RadComponents;

import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;
import com.inductiveautomation.perspective.common.api.ComponentDescriptorImpl;

public class ToastSileo {
    public static final String COMPONENT_ID = "rad.display.toastsileo";
        public static final String META_NAME = "toastSileo";

        public static JsonSchema getSchema(String resourcePath) {
                return JsonSchema.parse(
                                RadComponents.class.getResourceAsStream("/" + META_NAME.toLowerCase() + "/" + resourcePath));
        }

        public static final JsonSchema SCHEMA = getSchema("toastsileo.props.json");

    public static ComponentDescriptor DESCRIPTOR = ComponentDescriptorImpl.ComponentBuilder.newBuilder()
            .setPaletteCategory(RadComponents.COMPONENT_CATEGORY)
            .setId(COMPONENT_ID)
            .setModuleId(RadComponents.MODULE_ID)
            .setSchema(SCHEMA)
            .setName("05 ToastSileo")
            .setDefaultMetaName(META_NAME)
            .addPaletteEntry("", "ToastSileo", "Template component scaffold for toast notifications.", null, null)
            .setResources(RadComponents.BROWSER_RESOURCES)
            .build();
}
