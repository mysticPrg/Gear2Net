package net.gear2net.framework.object;

public abstract class G2NObject
{
	private boolean mIsNewObj = false;

	public boolean isNew()
	{
		return mIsNewObj;
	}

	protected void setIsNew()
	{
		mIsNewObj = true;
	}
}
