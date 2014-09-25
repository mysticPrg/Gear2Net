package net.gear2net.framework.msg.receive;

import java.util.Vector;
import java.util.concurrent.locks.ReentrantLock;

import net.gear2net.framework.object.G2NObject;

import org.json.JSONException;

public abstract class AgingMsg extends ReceiveMsg
{
	private static final int MSG_AGE_MAX = 10;

	private int mAge = MSG_AGE_MAX;

	private ReentrantLock mLock = null;

	public AgingMsg(String msg) throws JSONException
	{
		super(msg);
		mLock = new ReentrantLock();
	}

	public boolean isOldMsg()
	{
		if ( mAge == 0 )
			return true;

		return false;
	}

	public boolean isContainsNonCreatedObjectKey() throws JSONException
	{
		if ( mWidget.containsObject(getObjKey()) )
		{
			return false;
		} else
		{
			return true;
		}
	}

	public boolean isContainsNonCreatedArguments() throws JSONException, InterruptedException
	{
		if ( mArgs == null )
		{
			mArgs = getArgsImp();
		}
		return mArgs.contains(null);
	}

	public void rePutToRequestQueue() throws InterruptedException
	{
		mLock.lock();
		mAge--;
		mWidget.sendMsg(this);
		mLock.unlock();
	}

	public String getObjKey() throws JSONException
	{
		return mJson.getString("objKey");
	}

	public G2NObject getObject() throws JSONException
	{
		return mWidget.getObject(getObjKey());
	}

	public void putG2NObjectToWidget(G2NObject obj) throws JSONException
	{
		mWidget.putObject(getObjKey(), obj);
	}

	@SuppressWarnings("rawtypes")
	public Class[] getParameterTypes() throws JSONException, InterruptedException
	{
		Vector<Object> args = getArgs();
		Class[] paramTypes = new Class[args.size()];
		Object obj = null;
		ParamType type;
		for ( int i = 0; i < paramTypes.length; i++ )
		{
			obj = args.get(i);
			type = classToParamType(obj.getClass(), obj);
			switch ( type )
			{
				case BOOLEAN:
					paramTypes[i] = Boolean.TYPE;
					break;
				case BYTE:
					paramTypes[i] = Byte.TYPE;
					break;
				case CHAR:
					paramTypes[i] = Character.TYPE;
					break;
				case DOUBLE:
					paramTypes[i] = Double.TYPE;
					break;
				case FLOAT:
					paramTypes[i] = Float.TYPE;
					break;
				case G2NOBJECT:
					paramTypes[i] = obj.getClass();// G2NObject.class;
					break;
				case INT:
					paramTypes[i] = Integer.TYPE;
					break;
				case LONG:
					paramTypes[i] = Long.TYPE;
					break;
				case SHORT:
					paramTypes[i] = Short.TYPE;
					break;
				case STRING:
					paramTypes[i] = String.class;
					break;

			}
		}

		return paramTypes;
	}

}
