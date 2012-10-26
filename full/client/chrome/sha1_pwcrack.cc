/* Copyright (c) 2012 The Chromium Authors. All rights reserved.

This is the idea and implementaion by woFF, a distributed password hash cracker using Chrome native client.
Beta, but working :)

TODO: receive parameters like charset, brute-force range from server, upload the password result with the hash or job id, etc.

 */
#include <cstdio>
#include <cstring>
#include <stdlib.h>
#include <string.h>

#include <math.h>

#include "ppapi/cpp/instance.h"
#include "ppapi/cpp/module.h"
#include "ppapi/cpp/var.h"

#include "ppapi/c/pp_errors.h"
#include "ppapi/c/pp_module.h"
#include "ppapi/c/pp_var.h"
#include "ppapi/c/ppb.h"
#include "ppapi/c/ppb_instance.h"
#include "ppapi/c/ppb_messaging.h"
#include "ppapi/c/ppb_var.h"
#include "ppapi/c/ppp.h"
#include "ppapi/c/ppp_instance.h"
#include "ppapi/c/ppp_messaging.h"
#include "sha1.c"
#include <time.h>


static PPB_Messaging* ppb_messaging_interface = NULL;
static PPB_Var* ppb_var_interface = NULL;
PP_Instance g_Instance;

void PostMessage(const char *str);

double diffclock(clock_t clock1,clock_t clock2)
{
	double diffticks=clock1-clock2;
	double diffms=(diffticks*10)/CLOCKS_PER_SEC;
	return diffms;
}

void crack_stat(clock_t clock1, int i)
{
	clock_t clock2=clock();
	int elapsedtime = int(diffclock(clock2, clock1));
	fprintf(stdout, "Elapsed time: %dms (%d c/s)\r\n", elapsedtime, int((i*10)/elapsedtime));
}

static struct PP_Var CStrToVar(const char* str) {
  if (ppb_var_interface != NULL) {
    return ppb_var_interface->VarFromUtf8(str, strlen(str));
  }
  return PP_MakeUndefined();
}

static char* VarToCStr(struct PP_Var var) {
  uint32_t len = 0;
  if (ppb_var_interface != NULL) {
    const char* var_c_str = ppb_var_interface->VarToUtf8(var, &len);
    if (len > 0) {
      char* c_str = (char*)malloc(len + 1);
      memcpy(c_str, var_c_str, len);
      c_str[len] = '\0';
      return c_str;
    }
  }
  return NULL;
}

void PostMessage(const char *pwdhash_str) {
	return;
}

static PP_Bool Instance_DidCreate(PP_Instance instance,
                                  uint32_t argc,
                                  const char* argn[],
                                  const char* argv[]) {
	g_Instance = instance;

	
  return PP_TRUE;
}


/**
 * Called when the NaCl module is destroyed. This will always be called,
 * even if DidCreate returned failure. This routine should deallocate any data
 * associated with the instance.
 * @param[in] instance The identifier of the instance representing this NaCl
 *     module.
 */
static void Instance_DidDestroy(PP_Instance instance) {
}

/**
 * Called when the position, the size, or the clip rect of the element in the
 * browser that corresponds to this NaCl module has changed.
 * @param[in] instance The identifier of the instance representing this NaCl
 *     module.
 * @param[in] position The location on the page of this NaCl module. This is
 *     relative to the top left corner of the viewport, which changes as the
 *     page is scrolled.
 * @param[in] clip The visible region of the NaCl module. This is relative to
 *     the top left of the plugin's coordinate system (not the page).  If the
 *     plugin is invisible, @a clip will be (0, 0, 0, 0).
 */
static void Instance_DidChangeView(PP_Instance instance,
                                   PP_Resource view_resource) {
}

/**
 * Notification that the given NaCl module has gained or lost focus.
 * Having focus means that keyboard events will be sent to the NaCl module
 * represented by @a instance. A NaCl module's default condition is that it
 * will not have focus.
 *
 * Note: clicks on NaCl modules will give focus only if you handle the
 * click event. You signal if you handled it by returning @a true from
 * HandleInputEvent. Otherwise the browser will bubble the event and give
 * focus to the element on the page that actually did end up consuming it.
 * If you're not getting focus, check to make sure you're returning true from
 * the mouse click in HandleInputEvent.
 * @param[in] instance The identifier of the instance representing this NaCl
 *     module.
 * @param[in] has_focus Indicates whether this NaCl module gained or lost
 *     event focus.
 */
static void Instance_DidChangeFocus(PP_Instance instance,
                                    PP_Bool has_focus) {
}

/**
 * Handler that gets called after a full-frame module is instantiated based on
 * registered MIME types.  This function is not called on NaCl modules.  This
 * function is essentially a place-holder for the required function pointer in
 * the PPP_Instance structure.
 * @param[in] instance The identifier of the instance representing this NaCl
 *     module.
 * @param[in] url_loader A PP_Resource an open PPB_URLLoader instance.
 * @return PP_FALSE.
 */
static PP_Bool Instance_HandleDocumentLoad(PP_Instance instance,
                                           PP_Resource url_loader) {
  /* NaCl modules do not need to handle the document load function. */
  return PP_FALSE;
}



/**
 * Entry points for the module.
 * Initialize needed interfaces: PPB_Core, PPB_Messaging and PPB_Var.
 * @param[in] a_module_id module ID
 * @param[in] get_browser pointer to PPB_GetInterface
 * @return PP_OK on success, any other value on failure.
 */
PP_EXPORT int32_t PPP_InitializeModule(PP_Module a_module_id,
                                       PPB_GetInterface get_browser) {
  ppb_messaging_interface =
      (PPB_Messaging*)(get_browser(PPB_MESSAGING_INTERFACE));
  ppb_var_interface = (PPB_Var*)(get_browser(PPB_VAR_INTERFACE));
  return PP_OK;
}


static void Messaging_HandleMessage(PP_Instance instance,
                                    struct PP_Var message) {
	//std::string pwdhash_str = message.AsString();  

//	PostMessage("LOG:");
	//ppb_messaging_interface->PostMessage(g_Instance,message);
	
	// STARTING CRACKER IF MESSAGE IS RECEIVED

	uchar sha1sum [19];
	sha1_context ctx;
	uint i, j, k;
	uint n;
	uint o;
	uint MAX_LEN;
	uint max_possibilities;
	std::string charset;
	//const char * pwdhash_str = "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3";

	charset =  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
//	charset =  "0123456789";

	char theword[8];
	char theword_tmp[8];


	uint val;
	uint ch;

	clock_t begin=clock();

	const char * pwdhash_str = VarToCStr(message);

	uint hexsize=strlen(pwdhash_str);
	unsigned char* pwdhash_arr = new unsigned char[hexsize/2+1];
	pwdhash_arr[hexsize/2]='\0';

	fprintf(stdout, "INCOMING HASH: %s !!! \r\n", pwdhash_str);

	for (i=0;i<hexsize;i+=2,j++)
	{
		uint tmp;
		sscanf(pwdhash_str+i, "%2x",&tmp);
		pwdhash_arr[j]=tmp;
	}

	MAX_LEN=8;

	for (k=0; k<8; k++) { theword[k] = '\00'; }

	for(n=1; n<=MAX_LEN; n++) {
		max_possibilities = pow(charset.length(), n);
		for(i=0; i<max_possibilities; i++) {
			for (k=0; k<8; k++) { theword[k] = '\00'; }
			val = i;
			for (j=0; j<n; j++) {
				ch = val % charset.length();

				strcpy(theword_tmp, theword);
				theword[0] = charset[ch];
				for(k=0; k < strlen(theword_tmp); k++) {
					theword[k+1] = theword_tmp[k];
				}
				val = val / charset.length();
			}
			
			sha1_starts( &ctx );
			sha1_update( &ctx, (uchar *) theword, strlen( (const char *) theword ) );
			sha1_finish( &ctx, sha1sum );
			o=0;

			if ( (i % 10000000) == 0 and i!=0 ) {
				crack_stat(begin,i);
				/*fprintf(stdout, "TRYING: %s !!! \r\n", theword);
				for(o=0; o < strlen((const char*) sha1sum); o++) { 
					fprintf(stdout, "%02x," , sha1sum[o]);
					
				}

				for(o=0; o < strlen((const char*) pwdhash_arr); o++) { 
					fprintf(stdout, "%02x;" , pwdhash_arr[o]);
				}

				fprintf(stdout,"\r\n");
				*/
			}

			if (strcmp( (const char*) sha1sum, (const char*) pwdhash_arr)==0) {
				clock_t end=clock();				
				fprintf(stdout, "PASSWORD FOUND: %s !!! \r\n", theword);
				fprintf(stdout, "Elapsed time: %dms, %d c/s !!! \r\n", int(diffclock(end,begin)), int(i*10/diffclock(end,begin)) );
				ppb_messaging_interface->PostMessage(g_Instance, CStrToVar(theword));

				return;
			}

			
		}
	}
  //ppb_messaging_interface->PostMessage(g_Instance, CStrToVar(str));
  return;
}


/**
 * Returns an interface pointer for the interface of the given name, or NULL
 * if the interface is not supported.
 * @param[in] interface_name name of the interface
 * @return pointer to the interface
 */

PP_EXPORT const void* PPP_GetInterface(const char* interface_name) {
  if (strcmp(interface_name, PPP_INSTANCE_INTERFACE) == 0) {
    static PPP_Instance instance_interface = {
      &Instance_DidCreate,
      &Instance_DidDestroy,
      &Instance_DidChangeView,
      &Instance_DidChangeFocus,
      &Instance_HandleDocumentLoad,
    };
    return &instance_interface;
  }
	if (strcmp(interface_name, PPP_MESSAGING_INTERFACE) == 0) {
	    static PPP_Messaging messaging_interface = {
	      &Messaging_HandleMessage,
	    };
	    return &messaging_interface;
	  }
  return NULL;
}


/**
 * Called before the plugin module is unloaded.
 */
PP_EXPORT void PPP_ShutdownModule() {
}


