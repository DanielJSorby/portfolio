import pyautogui
import time

def updown(key, time):
    pyautogui.keyDown(key)
    time.sleep(time)
    pyautogui.keyUp(key)

time.sleep(1)

string = "curl parrot.live"

def write(string):
    pyautogui.typewrite(string)
    pyautogui.press('enter')

def terminalSring(string, times, terminal = 'terminal'):
    pyautogui.keyDown('command')
    pyautogui.keyDown('space')
    pyautogui.keyUp('command')
    pyautogui.keyUp('space')
    write(terminal)
    for i in range(times):
        write(string)
        pyautogui.keyDown('command')
        pyautogui.keyDown('n')
        pyautogui.keyUp('command')
        pyautogui.keyUp('n')
    write('touch DanielVarHer.lol')
    write('nano DanielVarHer.lol')
    for i in range(30):
        pyautogui.typewrite('Daniel var her')
        pyautogui.press('enter')
    # exit nano
    pyautogui.keyDown('ctrl')
    pyautogui.keyDown('x')
    pyautogui.keyUp('ctrl')
    pyautogui.keyUp('x')
    # save
    pyautogui.keyDown('y')
    pyautogui.keyUp('y')
    # exit
    pyautogui.keyDown('enter')
    pyautogui.keyUp('enter')
    write('clear')
    write('cat DanielVarHer.lol')
                                                                          
terminalSring(string, 10)