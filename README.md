# TASK

We would like you to create a very basic spinning slot machine in PIXI, using tweens to animate the spinning behaviour.

- It should display 5 symbols across with 4 symbols down.
- There should be a single button for spinning the slot machine.
- It should automatically stop spinning on its own, for a total spin time of three seconds.
- When it starts, all reels should start at the same time, but when it stops, each reel should stop in sequence from left to right.
- The symbols that each of the 5 reels spin through should be graphical representations of the numbers from the following 5-reel strips, wrapping around when the end of a reel is reached:
   

        [5, 4, 1, 3, 3, 5, 4, 0, 4, 3]
        [5, 5, 1, 4, 2, 0, 2, 3, 5, 5, 3, 1, 2, 4, 0]
        [3, 6, 4, 5, 2, 5, 5, 6]
        [3, 5, 4, 6, 2, 5, 2, 6, 1, 0]
        [1, 1, 6, 4, 1, 3, 2, 0, 3, 3]


 

The symbol and button graphics you use can come from anywhere. You could find some on the internet or make them yourself - up to you (this isn't an art role after all). As for the tweens, you can use any library you like (we use CreateJS/TweenJS) but do make sure you're using tweens for spinning and NOT manually moving symbols with frame-by-frame updates.

This task should take you no more than about 3-4 days at most. We would like to see some attempt to add your own features or 'flair' beyond the short brief. We recommend looking at some existing online slot games to get a sense of spin behaviour.