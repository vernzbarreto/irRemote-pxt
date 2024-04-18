enum  IrPins{
    P0=  0,
    P1=  1,
    P2=  2,
    P3=  3,
    P4=  4,
    P5=  5,
    P6=  6,
    P7=  7,
    P8=  8,
    P9=  9,
    P10= 10,
    P11= 11,
    P12= 12,
    P13= 13,
    P14= 14,
    P15= 15,
    P16= 16,
    P19= 19,
    P20= 20
};

enum EM_RemoteButton {
    //% block=A
    EM_A = 0x45,
    //% block=B
    EM_B = 0x46,
    //% block=C
    EM_C = 0x47,
    //% block=D
    EM_D = 0x44,
    //% block=+
    EM_Add = 0x43,
    //% block=-
    EM_Sub = 0x0d,
    //% block=UP
    EM_UP = 0x40,
    //% block=LEFT
    EM_Left = 0x07,
    //% block=OK
    EM_Ok = 0x15,
    //% block=RIGHT
    EM_Right = 0x09,
    //% block=DOWN
    EM_Down = 0x19,
    //% block=0
    EM_NUM0 = 0x16,
    //% block=1
    EM_NUM1 = 0x0c,
    //% block=2
    EM_NUM2 = 0x18,
    //% block=3
    EM_NUM3 = 0x5e,
    //% block=4
    EM_NUM4 = 0x08,
    //% block=5
    EM_NUM5 = 0x1c,
    //% block=6
    EM_NUM6 = 0x5a,
    //% block=7
    EM_NUM7 = 0x42,
    //% block=8
    EM_NUM8 = 0x52,
    //% block=9
    EM_NUM9 = 0x4a
};

enum RemoteButton {
    //% block=*
    A = 0x16,
    //% block=#
    B = 0x0D,
    //% block=UP
    UP = 0x18,
    //% block=LEFT
    Left = 0x08,
    //% block=OK
    Ok = 0x1C,
    //% block=RIGHT
    Right = 0x5A,
    //% block=DOWN
    Down = 0x52,
    //% block=0
    NUM0 = 0x19,
    //% block=1
    NUM1 = 0x45,
    //% block=2
    NUM2 = 0x46,
    //% block=3
    NUM3 = 0x47,
    //% block=4
    NUM4 = 0x44,
    //% block=5
    NUM5 = 0x40,
    //% block=6
    NUM6 = 0x43,
    //% block=7
    NUM7 = 0x07,
    //% block=8
    NUM8 = 0x15,
    //% block=9
    NUM9 = 0x09
};


/**
 * Custom blocks
 */
//% weight=100 color="#EE6A50" icon="\uf013" block="irRemote"
namespace EM_IR {
    let state: number;
    let data1: number;
    let irstate: number;
    let irData: number = -1;
    let irPin: number;

    /**
     * initialises local variables
     *  @param pin describe parameter here, eg: IrPins.P5 
     */
    //% weight=70
    //% block="ir remote init port | %pin" 
    export function IrRemote_init(pin: IrPins): void {
        irPin = pin;
        return;
    }

    //% shim=EMIR::irCode
    function em_irCode(irPin1: number): number {
        return 0;
    }

    /**
     * TODO: describe your function here
     * @param n describe parameter here, eg: 5
     * @param s describe parameter here, eg: "Hello"
     * @param e describe parameter here
     */
    //% weight=60
    //% block="read IR key value"
    export function EM_IR_read(): number {
        pins.setPull(getPin(), PinPullMode.PullUp)
        return valuotokeyConversion();
    }

    /**
     * TODO: describe your function here
     * @param value describe value here, eg: 5
     */
    //% weight=50
    //% blockId=onPressEvent
    //% block="on IR received"
    //% draggableParameters
    export function OnPressEvent(cb: (message: number) => void) {
        pins.setPull(getPin(), PinPullMode.PullUp)
        state = 1;
        control.onEvent(11, 22, function () {
            cb(data1)

        })
    }

    basic.forever(() => {
        if (state == 1) {
            irstate = em_irCode(irPin);
            if (irstate != 0) {
                data1 = irstate & 0xff;
                control.raiseEvent(11, 22)
            }
        }

        basic.pause(50);
    })

    function valuotokeyConversion(): number {
        //serial.writeValue("x", irCode() )
        let data = em_irCode(irPin);
        if (data == 0) {
        } else {
            irData = data & 0xff;
        }
        return irData;
    }

    function getPin(): number {
        switch (irPin) {
            case 0: return DigitalPin.P0;
            case 1: return DigitalPin.P1;
            case 2: return DigitalPin.P2;
            case 3: return DigitalPin.P3;
            case 4: return DigitalPin.P4;
            case 5: return DigitalPin.P5;
            case 6: return DigitalPin.P6;
            case 7: return DigitalPin.P7;
            case 8: return DigitalPin.P8;
            case 9: return DigitalPin.P9;
            case 10: return DigitalPin.P10;
            case 11: return DigitalPin.P11;
            case 12: return DigitalPin.P12;
            case 13: return DigitalPin.P13;
            case 14: return DigitalPin.P14;
            case 15: return DigitalPin.P15;
            case 16: return DigitalPin.P16;
            case 19: return DigitalPin.P19;
            case 20: return DigitalPin.P20;
            default: return DigitalPin.P0;
        }
    }
}
