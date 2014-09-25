package net.gear2net.framework.msg.receive;

import java.util.Vector;

import net.gear2net.framework.msg.G2NMsg;
import net.gear2net.framework.object.G2NObject;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public abstract class ReceiveMsg extends G2NMsg
{
	protected Vector<Object> mArgs = null;

	public ReceiveMsg(String msg) throws JSONException
	{
		mJson = new JSONObject(msg);
		mType = getTypeFromJson();
	}

	final public String getCallbackKey() throws JSONException
	{
		return mJson.getString("callbackKey");
	}

	public Vector<Object> getArgs() throws JSONException, InterruptedException
	{
		if ( mArgs == null )
		{
			mArgs = getArgsImp();
		}
		return mArgs;
	}

	protected Vector<Object> getArgsImp() throws JSONException, InterruptedException
	{
		Vector<Object> args = new Vector<Object>();

		JSONArray arrArgs = mJson.getJSONArray("args");
		int countOfArgs = arrArgs.length();
		for ( int i = 0; i < countOfArgs; i++ )
		{
			JSONObject arg = arrArgs.getJSONObject(i);
			if ( arg != null )
			{
				String type = arg.getString("type");
				String param = arg.getString("value");
				args.add(castingParam(ParamType.valueOf(type), param));
			}
		}

		return args;
	}

	private MsgType getTypeFromJson() throws JSONException
	{
		String strType = mJson.getString("msgType");
		MsgType type = MsgType.valueOf(strType);

		return type;
	}

	protected Object castingParam(ParamType type, String param) throws InterruptedException
	{
		Object castedParam = null;

		switch ( type )
		{
			case BYTE:
				castedParam = Byte.parseByte(param);
				break;
			case BOOLEAN:
				castedParam = Boolean.parseBoolean(param);
				break;
			case CHAR:
				castedParam = param.charAt(0);
				break;
			case DOUBLE:
				castedParam = Double.parseDouble(param);
				break;
			case FLOAT:
				castedParam = Float.parseFloat(param);
				break;
			case G2NOBJECT:
				castedParam = (G2NObject) mWidget.getObject(param);
				break;
			case INT:
				castedParam = Integer.parseInt(param);
				break;
			case LONG:
				castedParam = Long.parseLong(param);
				break;
			case SHORT:
				castedParam = Short.parseShort(param);
				break;
			case STRING:
				castedParam = param;
				break;
		}

		return castedParam;
	}
}
