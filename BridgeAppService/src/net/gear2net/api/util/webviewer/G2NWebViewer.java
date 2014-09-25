package net.gear2net.api.util.webviewer;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.regex.Pattern;

import net.gear2net.framework.object.G2NObject;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;

public class G2NWebViewer extends G2NObject
{

	/**
	 * "Enum Value" = null
	 */

	final private Lock mLock = new ReentrantLock();

	static public G2NWebViewer mInst = null;

	final static private String HTTP = "http://";
	final static private String HTTP_Regx = "[hH][tT][tT][pP][sS]?://.*";

	static public G2NWebViewer getInstance(Context context)
	{
		if ( mInst == null )
		{
			mInst = new G2NWebViewer(context);
		}
		return mInst;
	}

	private Context mContext = null;

	private G2NWebViewer(Context context)
	{
		mLock.lock();
		this.mContext = context;
		mLock.unlock();
	}

	public void showPage(String url)
	{
		mLock.lock();

		if ( Pattern.matches(HTTP_Regx, url) == false )
		{
			url = HTTP + url;
		}

		String[] urlArr = url.split("://");

		url = urlArr[0].toLowerCase() + "://" + urlArr[1];

		Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
		intent.addCategory(Intent.CATEGORY_BROWSABLE);
		intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		mContext.startActivity(intent);
		mLock.unlock();
	}
}
