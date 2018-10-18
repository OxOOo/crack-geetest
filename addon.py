# encoding: utf-8

from mitmproxy import ctx

class Counter:
	def __init__(self):
		self.num = 0

	def request(self, flow):
		self.num = self.num + 1
		ctx.log.info("We've seen %d flows" % self.num)
    
	def response(self, flow):
		print(flow)
		print(flow.request.path)
		if flow.request.path == '/static/js/geetest.6.0.9.js':
			print('=================================')
			del flow.response.headers["Content-Encoding"]
			del flow.response.headers["Age"]
			del flow.response.headers["Cache-Control"]
			del flow.response.headers["Date"]
			del flow.response.headers["ETag"]
			del flow.response.headers["Expires"]
			del flow.response.headers["Last-Modified"]
			del flow.response.headers["Ohc-File-Size"]
			del flow.response.headers["Ohc-Response-Time"]
			del flow.response.headers["Server"]
			del flow.response.headers["Transfer-Encoding"]
			content = open('geetest.6.0.9.js').read()
			flow.response.data.content = content
		if flow.request.path == '/login':
			print('|||||||||||||||||||||||||')
			del flow.response.headers["Content-Encoding"]
			del flow.response.headers["Cache-Control"]
			del flow.response.headers["Date"]
			del flow.response.headers["Expires"]
			del flow.response.headers["Server"]
			del flow.response.headers["Transfer-Encoding"]
			del flow.response.headers["X-Cache"]
			del flow.response.headers["X-TKID"]
			del flow.response.headers["X-Upstream"]
			content = open('login.html').read()
			flow.response.data.content = content

addons = [
    Counter()
]
