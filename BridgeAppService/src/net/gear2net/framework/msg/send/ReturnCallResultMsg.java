package net.gear2net.framework.msg.send;

import java.io.IOException;

import net.gear2net.framework.object.G2NObject;

import org.json.JSONException;

public class ReturnCallResultMsg extends SendMsg
{
	private G2NObject mNewObject = null;

	public ReturnCallResultMsg() throws JSONException
	{
		super(MsgType.RETURN_CALL_RESULT);
		mJson.put("newObj", "false");
	}

	public void setCallbackKey(String callbackKey) throws JSONException
	{
		mJson.put("callbackKey", callbackKey);
	}

	public void setReturn(Object returnValue) throws JSONException
	{
		if ( returnValue != null )
		{
			String newObj = "false";
			ParamType type = classToParamType(returnValue.getClass(), returnValue);
			mJson.put("returnType", type.toString());

			if ( type == ParamType.G2NOBJECT )
			{
				if ( ((G2NObject) returnValue).isNew() )
				{
					mNewObject = (G2NObject) returnValue;
					newObj = returnValue.getClass().getName();
				}
			}
			mJson.put("return", returnValue);
			mJson.put("newObj", newObj);
		} else
		{
			mJson.put("return", "null");
			mJson.put("returnType", "null");
			mJson.put("newObj", "false");
		}
	}

	@Override
	public synchronized void send() throws IOException, JSONException
	{
		if ( mNewObject != null && mWidget != null )
		{
			String objKey = mWidget.putObject(mNewObject);
			mJson.put("return", objKey);
		}
		super.send();
	}
}
