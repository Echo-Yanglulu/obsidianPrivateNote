[[传输层]]协议

建立TCP连接的过程
	1. 三次握手
		1. 客户端发送SYN包（seq=x）到服务器，进入SYN_SEND状态。等待服务器确认
		2. 服务端收到SYN包（ack=x+1），必须确认并发送一个SYN包(seq=y)，即SYN+ACK包。进入SYN_RECV状态
		3. 客户端收到SYN+ACK包，向服务器发送确认包ACK（ack=y+1）。客户端与服务端进入ESTABLISHED状态
	2. 四次挥手