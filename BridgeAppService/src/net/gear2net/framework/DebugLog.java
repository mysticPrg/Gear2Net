package net.gear2net.framework;

import android.util.Log;

public class DebugLog
{

	static private final String TAG = "G2NService";

	static private boolean mDebugMode = false;

	static public void log(String str)
	{
		if ( mDebugMode )
			Log.d(TAG, str);
	}

	static public void onDebugMode()
	{
		mDebugMode = true;
	}

	static public void offDebugMode()
	{
		mDebugMode = false;
	}
}
