package net.gear2net.api.util.keyboard;

import net.gear2net.R;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;

public class PopupActivity extends Activity
{
	private EditText mEdt_keyboard = null;
	private Button mBtn_ok = null;
	private Button mBtn_cancel = null;

	@Override
	protected void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
		setContentView(R.layout.act_popup);

		setTitle("Keyboard for Gear2");

		mEdt_keyboard = (EditText) findViewById(R.id.edt_keyboard);
		mBtn_ok = (Button) findViewById(R.id.btn_ok);
		mBtn_cancel = (Button) findViewById(R.id.btn_cancel);

		mBtn_ok.setOnClickListener(new OnClickListener()
		{
			@Override
			public void onClick(View v)
			{
				Intent intent = new Intent();
				intent.setAction(G2NKeyboard.G2NKEYBOARD_ACTION);
				intent.putExtra("isCancel", false);
				intent.putExtra("text", mEdt_keyboard.getText().toString());
				sendBroadcast(intent);
				finish();
			}
		});

		mBtn_cancel.setOnClickListener(new OnClickListener()
		{
			@Override
			public void onClick(View v)
			{
				Intent intent = new Intent();
				intent.setAction(G2NKeyboard.G2NKEYBOARD_ACTION);
				intent.putExtra("isCancel", true);
				sendBroadcast(intent);
				finish();
			}
		});
	}

	@Override
	protected void onDestroy()
	{
		super.onDestroy();
	}
}
