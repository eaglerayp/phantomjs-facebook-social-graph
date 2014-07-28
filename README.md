phantomjs introduction
============

This fbsocialcrawler get the facebook user's friends relationship.
It will traverse the facebook socail graph from the seed user and using BFS algorithm.
Reference a 2014 paper:[Design of a Crawler for Online Social Networks Analysis] (http://www.wseas.org/multimedia/journals/communications/2014/a165704-469.pdf)

###basic algorithm

				login to facebook;
				crawl();
				exit program;

				function crawl() {
				if queue of unvisited nodes is empty then
					stop crawling
				end if
				pop the first node in the queue
				load the user profile page
				if friends pagelet exists then
					get number of friends
					estimate time needed to load the full friend list 
					//by phantomjs' headless browser using height
				 	wait time estimated
					extractFriends();
				end if
				crawl();
				}