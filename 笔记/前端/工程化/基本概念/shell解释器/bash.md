定义

学会用bash编程，自动化地处理一些繁琐的需求
bash与任何一门语言一样，有套路

# 基本概念
[[shell]]

# bash脚本
# bash命令
cd
ls
rm
mkdir
ps
kill
常用命令
	文件
		新建
			touch
		删除
			rmdir 删除文件夹
			rm 删除某个文件/文件夹
			rm -r 递归删除
			rm -rf  强制递归删除
		移动
			mv 文件 目标文件夹
			mv -f 移动并覆盖
			mv -n 移动但不覆盖同名文件
		编辑
			cp 复制文件/文件夹
			cp -R递归复制
			一般用GUI（nano，vi/vim）vim的效率不输现代化的编辑器，如vscode
		查看
			cat 文件全部内容
			head -n 10  查看文件前10行
			tail 同理，后10行
	文件夹
		mkdir
	进程
		ps 查看当前用户进程
		ps -ax 查看所有进程
		kill 
			-9 
		lsof
			-i 查看打开的网络相关的文件
			-p 2333 查看pid(process id)为2333的进程打开的文件
		top 查看进程，平均负载，CPU使用率，物理内存
	其他