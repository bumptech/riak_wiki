One of the first advantages of Riak that should be highlighted is that it allows for quick prototyping and development. Unlike some databases, with Riak, you can spin up (and spin down) a large number of Riak nodes to use on your local environment when you are planning, testing, and building your application.

In this section, we will take you through the process to build a development environment. It's simple, and shouldn't take you more than a few minutes. Once you are done, you will have a three node Riak cluster running on your local machine.

To make it as easy as possible, we've recorded a screencast. If you don't like videos and prefer to read, the instructions below mirror those that are in the screencast. Either way you choose, you'll have a three node Riak cluster in no time!

<div class="note"><div class="title">A few things to note before we start</div>

<ul>
<li>You do not need to download and build Erlang from source to install Riak. We
have pre-packaged binaries available for most major platforms that embed the
Erlang runtime.  However, for source builds, you'll need to have Erlang R13B04,
and this tutorial is based on a source build. Current Riak development has moved
to Erlang R14B02 or later, but for this tutorial, Erlang R13B04 is the way to
go.</li>

<li>The setup outlined below that you are about to build sets up nodes with HTTP interfaces
listening on ports 8091-3. The default port for nodes to listen on is 8098 and users will
need to take note of this when trying to use any of the default other-language client
settings.</li>

<li>There are various screencasts throughout the Riak Fast Track. At the time they were
made, Basho was using Mercurial and Bitbucket for our version control system and development
platform, respectively. We have since switched to Git and GitHub but the screencasts do not
yet reflect this. Do not be alarmed. We will re-record these using Git/GitHub when time
permits.</li>
</ul>
</div>

## Downloading Riak and Building a Three Node Cluster
 
<div style="display:none" class="iframe-video" id="http://player.vimeo.com/video/11240885"></div>

<a href="http://vimeo.com/11240885">Setting up a Three Node Riak Cluster</a> from <a href="http://vimeo.com/bashotech">Basho Technologies</a> on <a href="http://vimeo.com">Vimeo</a>.

### Download and install Erlang

We have platform specific instructions written up for downloading a compatible version of Erlang located [[here|Installing Erlang]]. If you don't already have Erlang R13B04 installed, go do so and hurry back.

### Download the source code of the latest Riak version

You can always find the latest release of Riak in our [downloads directory](http://downloads.basho.com/riak/CURRENT/).
The current version is 0.14.2, and you can download the [source code
here](http://downloads.basho.com/riak/riak-0.14/riak-0.14.2.tar.gz). Unpack the package once downloaded, and you're
ready for the next step.

### Build Riak

So now you have a copy of Riak. Time to build it. Do this by accessing the "riak" directory and running "make all"

```bash
$ cd riak-0.14.2
$ make all
```

As you can see, "make all" is grabbing all the Riak dependencies for you so that you don't have to chase them down. This should take a few moments.

### Use Rebar to start up three nodes

Now that Riak is built, we are going to use Rebar, a packaging and build system for Erlang applications, to get three self-contained Riak nodes running on your machine. Tomorrow, when you put Riak into production, Rebar will enable you to ship a pre-built Riak package to your deployment machines. But for now, we will just stick to the three nodes. To start these up, run "make devrel"

```bash
$ make devrel
```

You have just generated a "dev" directory. Let's go into that directory to check out its contents:

```bash
$ cd dev; ls
```

That should give you the following:

```bash
dev1       dev2       dev3
```

Each directory starting with "dev" is a complete package containing a Riak node. We now need to start each node. Let's start with "dev1"

```bash
$ dev1/bin/riak start
```

Then do the same for "dev2" and "dev3"

```bash
$ dev2/bin/riak start
$ dev3/bin/riak start
```

### Test to see the running Riak nodes

After you have the nodes up and running, it's time to test them and make sure they are available. You can do this by taking a quick look at your process list. To do this, run:

```bash
$ ps aux | grep beam
```

This should give you details on three running Riak nodes.

### Join the nodes to make a cluster

The next step is to join these three nodes together to form a cluster. You can do this using the Riak Admin tool. Specifically, what we want to do is join "dev2" and "dev3" to "dev1":

```bash
$ dev2/bin/riak-admin join dev1@127.0.0.1
$ dev3/bin/riak-admin join dev1@127.0.0.1
```

<div class="info"><div class="title">About riak-admin</div>
riak-admin is Riak's administrative tool. It's used to do any operational tasks
other than starting and stopping node, e.g. to join and leave a cluster, to back
up data, and to manage general cluster operations. For more information on
riak-admin, check our <a
href="http://wiki.basho.com/Command-Line-Tools.html#riak-admin">page dedicated
to the command line tools</a> that come with Riak.
</div>

### Test the cluster and add some data to verify the cluster is working

Great. We now a have a running three node Riak cluster. Let's make sure it's working correctly. For this we can hit Riak's HTTP interface using _curl_. Try this:

```bash
$ curl -H "Accept: text/plain" http://127.0.0.1:8091/stats
```

Once this runs, look for a field in the output named "ring_ownership." This should show you that all three of your nodes are part of your Riak cluster. You might also notice that each node has claimed a set of partitions. The default partition setting for our three node development cluster is 64. This means that two of the three nodes will have claimed 21 partitions, and the third node will handle the last 22.

<div class="info">
The number of partitions in your cluster is set with by the parameter [[ring_creation_size|Configuration Files#ring_creation_size]] in Riak's app.config file.
</div>

If you want, you can add a file to your Riak cluster and test it's working properly. Let's say, for instance, we wanted to add an image and make sure it was accessible. First, copy an image to your directory if you don't already have one:

```bash
$ cp ~/image/location/image_name.jpg .
```

We can then PUT that image into Riak using a curl command:

```bash
$ curl -X PUT HTTP://127.0.0.1:8091/riak/images/1.jpg \
  -H "Content-type: image/jpeg" --data-binary @image_name.jpg
```

You can then verify that image was in fact stored. To do this, simply copy the URL where we PUT the image and paste it into a browser. Your image should appear.

You should now have a running, three node Riak cluster. Congratulations! That didn't take so long, did it?

*What's Next? You now have a three node Riak cluster up and running.* *[[Time to learn about the basic HTTP API operations.|Basic Riak API Operations]]*

<div class="info"><div class="title">Additional Reading</div>* [[Rebar Documentation|https://github.com/basho/rebar/wiki]]</div>
