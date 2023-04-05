# edytor

### TODO
N log window for error messages

- add pixel tools first -> mid april
    - color picker 2d
    - select existing shape 3d
    - select custom shape 3d
    - magic wand 3d
    - delete selection 2d
    - fill selection 2d
    - move selection 3d
    - move layer 4d
- rotate tool -> april
- scale tool -> april
- zoom -> april

- palette -> may
- open -> may
- save -> may
- cut, copy, paste -> may
- shell -> may
- logs, verbose mode -> may

- list basic functionality that is missing for it to become paint -> june
- tweaking
- release 0.1 - august/september

### Tools

* select
* move
* edit shape
* rotate
* scale



### Functionality of basic tools

* select one
* select many by using ctrl/cmd
* select many by drawing a rectangle


* move one
* move selected


* scale in/out
* rotate 90, 180, 270
* rotate freely


* zoom in
* zoom out


* select a point
* select many points with ctrl/cmd
* select many by drawing a rectangle


* move a point
* move selected points
* delete a point
* add a point


### Controls

Two operation modes or one operation modee

* using mouse
* using keyboard

Additionally:

* input at the bottom where you can enter with its arguments

It should be possible to do things just using keyboard. And also, at the same
time, commands can be used to do things. However, when using a command, all
the arguments have to be passed. It's going to be very difficult to draw a
polygon using separate commands instead of giving all the point coordinates
straight away as command args.

Maybe it is going to be possible to have a mode where you can use both mouse
and keyboard. For example, when drawing a polygon, instead of choosing next
point with mouse, a keyboard shortcut can be used which would show a window
where coordinates would be entered.

Anyway, everything should go through a command (a `Do()` function).


### Todo 2

* input at the bottom
* ensure everything it's done so far goes through command, and after command
it refreshes the layout
* shall the command be extracted to separate classes?

