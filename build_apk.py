import os, zipfile, shutil

app_name = "FES Slipnet Importer"
package = "com.fes.slipnetimporter"
html_file = "fes-importer.html"  # your HTML file name

# Create folder structure
os.makedirs("FESApp/assets", exist_ok=True)
os.makedirs("FESApp/res/values", exist_ok=True)
os.makedirs("FESApp/res/mipmap-hdpi", exist_ok=True)

# Copy your HTML
shutil.copy(html_file, "FESApp/assets/index.html")

# Create AndroidManifest.xml
with open("FESApp/AndroidManifest.xml", "w") as f:
    f.write(f'''<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="{package}">
    <uses-permission android:name="android.permission.INTERNET"/>
    <application
        android:allowBackup="true"
        android:label="{app_name}"
        android:theme="@style/AppTheme">
        <activity android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
            <intent-filter>
                <action android:name="android.intent.action.VIEW"/>
                <category android:name="android.intent.category.DEFAULT"/>
                <category android:name="android.intent.category.BROWSABLE"/>
                <data android:scheme="slipnet-enc"/>
            </intent-filter>
        </activity>
    </application>
</manifest>''')

# Create style
with open("FESApp/res/values/styles.xml", "w") as f:
    f.write('''<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="android:Theme.Material.NoActionBar">
        <item name="android:statusBarColor">#0a0e1a</item>
    </style>
</resources>''')

# Create MainActivity.java
os.makedirs("FESApp/src/com/fes/slipnetimporter", exist_ok=True)
with open("FESApp/src/com/fes/slipnetimporter/MainActivity.java", "w") as f:
    f.write('''package com.fes.slipnetimporter;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import androidx.appcompat.app.AppCompatActivity;
public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WebView webView = new WebView(this);
        setContentView(webView);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setDomStorageEnabled(true);
        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl("file:///android_asset/index.html");
    }
}''')

print("✅ App structure created in 'FESApp/' folder")
print("To build APK: install Android SDK + run 'gradle assembleDebug'")
print("Or use the online APK builders mentioned above for a quick APK.")
