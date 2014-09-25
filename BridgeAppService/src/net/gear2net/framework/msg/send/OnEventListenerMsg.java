package net.gear2net.framework.msg.send;

import java.util.Vector;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class OnEventListenerMsg extends SendMsg
{
	public OnEventListenerMsg() throws JSONException
	{
		super(MsgType.ON_EVENT_LISTENER);
	}
	
	public void setListenerKey(String listenerKey) throws JSONException
	{
		mJson.put("listenerKey", listenerKey);
	}
	
	public void setArgs(Vector<Object> args) throws JSONException
	{
		if ( args == null )
		{
			mJson.put("args", "null");
			return;
		}
		
		int countOfArgs = args.size();
		JSONArray jsonArgs = new JSONArray();
		JSONObject jsonObj = null;
		ParamType paramType;
		Object param;
		
		for ( int i=0 ; i<countOfArgs ; i++ )
		{
			jsonObj = new JSONObject();
			param = args.get(i);
			paramType = classToParamType(param.getClass(), param);
			jsonObj.put("value", param);
			jsonObj.put("type", paramType.toString());
			
			jsonArgs.put(jsonObj);
		}

		mJson.put("args", jsonArgs);
	}
}
