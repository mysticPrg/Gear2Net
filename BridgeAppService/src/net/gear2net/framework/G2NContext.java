package net.gear2net.framework;

import net.gear2net.framework.object.G2NObject;
import android.content.Context;

public class G2NContext extends G2NObject
{
	Context mContext = null;

	private static G2NContext mInst = null;

	public static G2NContext getInstance(Context context)
	{
		if ( mInst == null )
		{
			mInst = new G2NContext(context);
		}

		return mInst;
	}

	private G2NContext(Context context)
	{
		mContext = context;
	}

	public Context getContext()
	{
		return mContext;
	}
}
