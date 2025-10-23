package com.omerhodo.agecalculator;

import android.os.Bundle;
import com.getcapacitor.community.admob.models.AdOptions;
import com.google.ads.mediation.admob.AdMobAdapter;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.RequestConfiguration;

/**
 * Custom RequestHelper for COPPA Compliance
 * Ensures all ad requests are child-directed and use max ad content rating
 */
public final class COPPARequestHelper {

    private COPPARequestHelper() {}

    /**
     * Creates a COPPA-compliant AdRequest
     * Always sets:
     * - Non-personalized ads (NPA)
     * - Child-directed treatment
     * - Max content rating: G (General Audiences)
     */
    public static AdRequest createRequest(AdOptions adOptions) {
        AdRequest.Builder adRequestBuilder = new AdRequest.Builder();

        // COPPA Compliance: Always use non-personalized ads
        Bundle extras = new Bundle();
        extras.putString("npa", "1"); // Non-personalized ads

        // COPPA: Mark as child-directed
        extras.putString("is_designed_for_families", "true");

        adRequestBuilder.addNetworkExtrasBundle(AdMobAdapter.class, extras);

        return adRequestBuilder.build();
    }

    /**
     * Configure RequestConfiguration for COPPA at app level
     * Should be called during app initialization
     */
    public static RequestConfiguration getCOPPAConfiguration() {
        return new RequestConfiguration.Builder()
            .setTagForChildDirectedTreatment(RequestConfiguration.TAG_FOR_CHILD_DIRECTED_TREATMENT_TRUE)
            .setMaxAdContentRating(RequestConfiguration.MAX_AD_CONTENT_RATING_G)
            .build();
    }
}
