navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    //connection
    // PeerJS object
    var leng =8;
	var str ="abcdefghijklmnopqrstuvwxyz0123456789";
	var strLeng = str.length;
	var id ="";
	for(var i=0; i<leng; i++){
		id += str[Math.floor(Math.random()*strLeng)];
	}
    var peer = new Peer(id+'_pc',{ key: 'Type Your key', debug: 3});
    //UserAgent
    var ua = 'pc';
	var idList = [];
	var myid;
	var pcStream;
	var pcCall;
	var call;
    
    peer.on('open', function(){
      $('#my-id').text(peer.id);
	   myid = peer.id;
       //console.log(peer);
       //console.log(peer.connect);
	   getIds();
	   //console.log(idList);
	   //console.log(id);
	});

    // Receiving a call
    peer.on('call', function(call){
      // Answer the call automatically (instead of prompting user) for demo purposes
      call.answer(window.localStream);
	  console.log(call.peer);
	  if(call.peer.match('_pc')){
			console.log('matching: pc');
		}else{
			console.log("matching: mobile");
			setTimeout(function (){
			call.close();	
			},10000);
		}
      step3(call);
    });

    peer.on('error', function(err){
      alert(err.message);
      // Return to step 2 if error occurs
      step2();
    });

    // Click handlers setup
    $(function(){
     // $('#make-call').click(function(){
        // Initiate a call
     //     var  call = peer.call($('#callto-id').val(),window.localStream);
      //    step3(call);
     // });

      $('#end-call').click(function(){
        //window.existingCall.close();
        //step2();
      });

      // Retry if getUserMedia fails
      //$('#step1-retry').click(function(){
      //  $('#step1-error').hide();
      //  step1();
      //});
      //
      // Get things started
      step1();
    });

    function step1 () {
      // Get audio/video stream
      navigator.getUserMedia({audio: false, video: true}, function(stream){
        // Set your video displays
//        $('#my-video').prop('src', URL.createObjectURL(stream));
        window.localStream = stream;
        step2();
      }, function(){ $('#step1-error').show(); });
    }
	
	// change to call view
    function step2 () {
      $('#step1, #step3').hide();
      $('#step2').show();
    }

	// settings MediaConnection
    function step3 (call) {
      // Hang up on an existing call if present
      //if (window.existingCall) {
     //   window.existingCall.close();
      //}
      //: Wait for stream on the call, then set peer video display
      call.on('stream', function(stream){
       		 $('#pc-video').prop('src', URL.createObjectURL(stream));

			 if(call.peer.match('_pc')){
				pcCall = call;
				pcStream = stream;
			}

      });
	  //Callが閉じた時
      call.on('close', function(){
	console.log("onclose");
		$('#pc-video').prop('src',URL.createObjectURL(pcStream));	
	  });
      // UI stuff
      //window.existingCall = call;
      $('#their-id').text(call.peer);
      $('#step1, #step2').hide();
      $('#step3').show();
    }
	//全てのidを取得
	function getIds(){
		peer.listAllPeers(function(list){
			for(var cnt =0;cnt < list.length;cnt++){
				if(myid != list[cnt]){
						idList.push(list[cnt]);
						//PCにつなぐ
						if(list[cnt].match('_pc')){
								call = peer.call(list[cnt],window.localStream);
								step3(call);
							}
						}
			}
		});
	}
