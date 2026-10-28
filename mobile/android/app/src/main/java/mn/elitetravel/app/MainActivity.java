package mn.elitetravel.app;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.WebViewListener;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

/**
 * Native shell around the live site: runs www/native-shell.js (shared with iOS) on
 * every page and turns off zoom and the overscroll glow so it feels like an app.
 */
public class MainActivity extends BridgeActivity {
    private String shellScript;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        WebView webView = getBridge().getWebView();
        WebSettings settings = webView.getSettings();
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setTextZoom(100);
        webView.setOverScrollMode(WebView.OVER_SCROLL_NEVER);
        webView.setHapticFeedbackEnabled(false);
        webView.setLongClickable(false);

        shellScript = readAsset("public/native-shell.js");
        getBridge().addWebViewListener(new WebViewListener() {
            @Override
            public void onPageLoaded(WebView view) {
                if (shellScript != null) view.evaluateJavascript(shellScript, null);
            }
        });
    }

    private String readAsset(String path) {
        try (InputStream in = getAssets().open(path); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) != -1) out.write(buf, 0, n);
            return out.toString(StandardCharsets.UTF_8.name());
        } catch (Exception e) {
            return null;
        }
    }
}
