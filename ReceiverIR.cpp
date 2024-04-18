#include "pxt.h"

namespace EMIR { 
int ir_code = 0x00;
int ir_addr = 0x00;
int data;

int getPinsValue(int name) {
    // int id = (int)name;
    switch (name) {
        case 0: return uBit.io.P0.getDigitalValue();
        case 1: return uBit.io.P1.getDigitalValue();
        case 2: return uBit.io.P2.getDigitalValue();
        case 3: return uBit.io.P3.getDigitalValue();
        case 4: return uBit.io.P4.getDigitalValue();
        case 5: return uBit.io.P5.getDigitalValue();
        case 6: return uBit.io.P6.getDigitalValue();
        case 7: return uBit.io.P7.getDigitalValue();
        case 8: return uBit.io.P8.getDigitalValue();
        case 9: return uBit.io.P9.getDigitalValue();
        case 10: return uBit.io.P10.getDigitalValue();
        case 11: return uBit.io.P11.getDigitalValue();
        case 12: return uBit.io.P12.getDigitalValue();
        case 13: return uBit.io.P13.getDigitalValue();
        case 14: return uBit.io.P14.getDigitalValue();
        case 15: return uBit.io.P15.getDigitalValue();
        case 16: return uBit.io.P16.getDigitalValue();
        case 19: return uBit.io.P19.getDigitalValue();
        case 20: return uBit.io.P20.getDigitalValue();
        // default: return NULL;
    }
}



int logic_value(int irPin){//判断逻辑值"0"和"1"子函数
    uint32_t lasttime = system_timer_current_time_us();
    uint32_t nowtime;
    while(!getPinsValue(irPin));//低等待
    nowtime = system_timer_current_time_us();
    if((nowtime - lasttime) > 400 && (nowtime - lasttime) < 700){//低电平560us
        while(getPinsValue(irPin));//是高就等待
        lasttime = system_timer_current_time_us();
        if((lasttime - nowtime)>400 && (lasttime - nowtime) < 700){//接着高电平560us
            return 0;
        }else if((lasttime - nowtime)>1500 && (lasttime - nowtime) < 1800){//接着高电平1.7ms
            return 1;
       }
    }
    return -1;
}

void pulse_deal(int irPin){
    int i;
    ir_addr=0x00;//清零
    for(i=0; i<16;i++ )
    {
      if(logic_value(irPin) == 1)
      {
        ir_addr |=(1<<i);
      }
    }
    //解析遥控器编码中的command指令
    ir_code=0x00;//清零
    for(i=0; i<16;i++ )
    {
      if(logic_value(irPin) == 1)
      {
        ir_code |=(1<<i);
      }
    }

}

void remote_decode(int irPin){
    data = 0x00;
    uint32_t lasttime = system_timer_current_time_us();
    uint32_t nowtime;
    while(getPinsValue(irPin)){//高电平等待
        nowtime = system_timer_current_time_us();
        if((nowtime - lasttime) > 100000){//超过100 ms,表明此时没有按键按下
            ir_code = 0xff00;
            return;
        }
    }
    //如果高电平持续时间不超过100ms
    lasttime = system_timer_current_time_us();
    while(!getPinsValue(irPin));//低等待
    nowtime = system_timer_current_time_us();
    if((nowtime - lasttime) < 10000 && (nowtime - lasttime) > 8000){//9ms
        while(getPinsValue(irPin));//高等待
        lasttime = system_timer_current_time_us();
        if((lasttime - nowtime) > 4000 && (lasttime - nowtime) < 5000){//4.5ms,接收到了红外协议头且是新发送的数据。开始解析逻辑0和1
            pulse_deal(irPin);
            //uBit.serial.printf("addr=0x%X,code = 0x%X\r\n",ir_addr,ir_code);
            data = ir_code;
            return;//ir_code;
        }else if((lasttime - nowtime) > 2000 && (lasttime - nowtime) < 2500){//2.25ms,表示发的跟上一个包一致
            while(!getPinsValue(irPin));//低等待
            nowtime = system_timer_current_time_us();
            if((nowtime - lasttime) > 500 && (nowtime - lasttime) < 700){//560us
                //uBit.serial.printf("addr=0x%X,code = 0x%X\r\n",ir_addr,ir_code);
                data = ir_code;
                return;//ir_code;
            }
        }
    }
}

 //% 
    int irCode(int irPin){
    remote_decode(irPin);
    return data;
    }
}