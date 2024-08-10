package com.formanagement.app;

import android.os.Bundle;

import org.devio.rn.splashscreen.SplashScreen;
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "ForManegement";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    setTheme(R.style.AppTheme);
    SplashScreen.show(this); // here
    // super.onCreate(savedInstanceState);

    // Make sure this is before calling super.onCreate

    super.onCreate(null);
    // ...
  }
}
