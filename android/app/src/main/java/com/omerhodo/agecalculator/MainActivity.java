package com.omerhodo.agecalculator;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.RequestConfiguration;

/**
 * Main Activity with COPPA Compliance
 */
public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // COPPA Compliance: Configure AdMob for child-directed treatment
        RequestConfiguration requestConfiguration = new RequestConfiguration.Builder()
            .setTagForChildDirectedTreatment(RequestConfiguration.TAG_FOR_CHILD_DIRECTED_TREATMENT_TRUE)
            .setMaxAdContentRating(RequestConfiguration.MAX_AD_CONTENT_RATING_G)
            .build();

        MobileAds.setRequestConfiguration(requestConfiguration);

        // Note: MobileAds.initialize() is called by the AdMob plugin
        // We just set the request configuration before any ads are loaded
    }
}
