package net.gear2net.framework.msg;

import net.gear2net.framework.G2NWidget;
import net.gear2net.framework.msg.receive.ConstructorMsg;
import net.gear2net.framework.msg.receive.DestructorMsg;
import net.gear2net.framework.msg.receive.MethodCallMsg;
import net.gear2net.framework.msg.receive.RegistrationListenerMsg;
import net.gear2net.framework.msg.receive.StatusMsg;
import net.gear2net.framework.msg.receive.UnregistrationListenerMsg;
import net.gear2net.framework.object.G2NObject;

import org.json.JSONException;
import org.json.JSONObject;

import com.samsung.android.sdk.accessory.SASocket;

public abstract class G2NMsg
{	
	public enum MsgType
	{
		// Gear2 -> BridgeApp
		CONSTRUCTOR,
		DESTRUCTOR,
		METHOD_CALL,
		REGISTRATION_LISTENER,
		UNRESISTRATION_LISTENER,
		STATUS,
		
		// BridgeApp -> Gear2
		RETURN_CALL_RESULT,
		ON_EVENT_LISTENER,
		EXCEPTION
	}
	
	public enum ParamType
	{
		BYTE,
		SHORT,
		CHAR,
		INT,
		LONG,
		FLOAT,
		DOUBLE,
		BOOLEAN,
		STRING,
		G2NOBJECT
	}
	
	protected MsgType mType;
	protected JSONObject mJson = null;
	protected G2NWidget mWidget = null;
	protected SASocket mSocket = null; 
	
	static public G2NMsg createMsg(String msgStr) throws JSONException
	{
		G2NMsg msg = null;
		
		JSONObject jsonObj = new JSONObject(msgStr);
		MsgType type = MsgType.valueOf(jsonObj.getString("msgType"));
		
		switch ( type )
		{
			case CONSTRUCTOR:
				msg = new ConstructorMsg(msgStr);
				break;
			case DESTRUCTOR:
				msg = new DestructorMsg(msgStr);
				break;
			case METHOD_CALL:
				msg = new MethodCallMsg(msgStr);
				break;
			case REGISTRATION_LISTENER:
				msg = new RegistrationListenerMsg(msgStr);
				break;
			case STATUS:
				msg = new StatusMsg(msgStr);
				break;
			case UNRESISTRATION_LISTENER:
				msg = new UnregistrationListenerMsg(msgStr);
				break;
			default:
				break;
		}
		
		return msg;
	}
	
	protected G2NMsg() {}
	
	@Override
	public String toString()
	{
		return mJson.toString();
	}
	
	public void setWidget(G2NWidget widget)
	{
		mWidget = widget;
	}
	
	public void setSocket(SASocket socket)
	{
		mSocket = socket;
	}
	
	public SASocket getSocket()
	{
		return mSocket;
	}
	
	public String getWID() throws JSONException
	{
		return mJson.getString("wID");
	}
	
	public MsgType getType()
	{
		return mType;
	}
	
	protected ParamType classToParamType(Class<?> paramClass, Object param)
	{
		String className = paramClass.getName();
		ParamType type = ParamType.BOOLEAN;
		
		if ( Integer.class.getName().equals(className) ) 			type = ParamType.INT;
		else if ( Boolean.class.getName().equals(className) )		type = ParamType.BOOLEAN;
		else if ( Byte.class.getName().equals(className) )			type = ParamType.BYTE;
		else if ( Character.class.getName().equals(className) )		type = ParamType.CHAR;
		else if ( Double.class.getName().equals(className) )		type = ParamType.DOUBLE;
		else if ( Float.class.getName().equals(className) )			type = ParamType.FLOAT;
		else if ( Long.class.getName().equals(className) )			type = ParamType.LONG;
		else if ( Short.class.getName().equals(className) )			type = ParamType.SHORT;
		else if ( String.class.getName().equals(className) )		type = ParamType.STRING;
		else if ( param instanceof G2NObject )						type = ParamType.G2NOBJECT;
		
		return type;
	}
}

